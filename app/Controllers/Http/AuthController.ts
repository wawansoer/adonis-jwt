import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import { v4 as uuid } from 'uuid'
import User from '../../Models/User'
import ApiToken from '../../Models/ApiToken'
import RegisterValidator from '../../Validators/Auth/RegisterValidator'
import RoleUser from '../../Models/RoleUser'
import Role from '../../Models/Role'
import LoginValidator from '../../Validators/Auth/LoginValidator'
import ForgotPasswordValidator from '../../Validators/Auth/ForgotPasswordValidator'
import UpdatePasswordValidator from '../../Validators/Auth/UpdatePasswordValidator'

enum EmailAction {
	Verification = 'Account Verification',
	ResetPassword = 'Reset Password',
}

export default class AuthController {
	/**
	 * Create a new user and save it to the database.
	 */
	private async createUser(
		email: string,
		password: string,
		username: string,
		trx: any
	): Promise<User> {
		const user = new User()
		user.email = email
		user.password = password
		user.username = username
		return await user.useTransaction(trx).save()
	}

	/**
	 * Insert a new user role and save it to the database.
	 */
	private async createUserRole(user_id: string, role_id: string, trx: any): Promise<RoleUser> {
		const roleUser = new RoleUser()
		roleUser.userId = user_id
		roleUser.roleId = role_id
		return await roleUser.useTransaction(trx).save()
	}

	/**
	 * Generate a verification token for the given user and save it to the database.
	 */
	private async generateToken(userId: string, tokenName: string, trx: any): Promise<ApiToken> {
		const token = new ApiToken()
		token.userId = userId
		token.name = tokenName
		token.type = 'UUID'
		token.token = uuid()
		token.expiresAt = DateTime.now().plus({ hours: 1 })

		await token.useTransaction(trx).save()

		return token
	}

	/**
	 * Send a verification email to the given user with the verification token.
	 */
	private async sendEmail(user: User, token: ApiToken, action: string) {
		let url, msg
		const base_url = Env.get('FRONT_END_URL')

		if (action === EmailAction.Verification) {
			url = `${base_url}/verify-email?token=${token.token}&$email=${user.email}`
			msg = `Tap the button below to confirm your email address. If you didn't create an account, you can safely delete this email.`
		} else if (action === EmailAction.ResetPassword) {
			url = `${base_url}/forgot-password?token=${token.token}&$email=${user.email}`
			msg = `Tap the button below to reset your password. If you didn't request reset your password, you can safely delete this email.`
		}

		await Mail.send((message) => {
			message
				.from(Env.get('SMTP_USERNAME'))
				.to(user.email)
				.subject(action)
				.htmlView('emails/welcome.edge', {
					username: user.username,
					url: url,
					type_of_action: action,
					message: msg,
					from: Env.get('SMTP_USERNAME'),
				})
		})
	}

	/**
	 * Register a new user.
	 */
	public async register({ request, response }: HttpContextContract) {
		const trx = await Database.transaction()

		try {
			const data = await request.validate(RegisterValidator)

			const user = await this.createUser(data.email, data.password, data.username, trx)

			// get role
			const role = await Role.query().where('slug', 'guest').firstOrFail()
			// insert into user_role
			await this.createUserRole(user.id, role.id, trx)

			const token = await this.generateToken(user.id, EmailAction.Verification, trx)

			await this.sendEmail(user, token, EmailAction.Verification)

			await trx.commit()

			return response.status(201).json({
				success: true,
				message: 'Successfully registered. Please confirm email to login!',
				user,
			})
		} catch (error) {
			Logger.error(error)
			if (trx && trx.isTransaction) {
				await trx.rollback()
			}

			let errorMessage = error.messages
				? 'Validation failed'
				: 'Failed to send email confirmation'

			return response.status(error.messages ? 400 : 500).json({
				success: false,
				message: errorMessage,
				error: error.messages ? error.messages : error.message,
			})
		}
	}

	/**
	 * Verify the email of a user using the verification token.
	 */
	public async verifyEmail({ request, response }: HttpContextContract) {
		try {
			const { token, email } = request.only(['token', 'email'])

			const apiToken = await ApiToken.query()
				.where('token', token)
				.where('expires_at', '>=', DateTime.now().toString())
				.firstOrFail()

			const user = await User.findBy('email', email)

			if (user) {
				user.is_verified = true

				await user.save()

				await apiToken.delete() // Delete the verification token from the database

				return response.status(200).json({
					success: true,
					message: 'Account activated successfully',
				})

			} else {

				return response.status(404).json({
					success: false,
					message: 'User not found',
				})
			}
		} catch (error) {
			Logger.error(error)

			return response.status(500).json({
				success: false,
				message: 'Failed to activate the account',
				error: error,
			})
		}
	}

	/**
	 * Resend the verification token to the user's email.
	 */
	public async resendToken({ request, response }: HttpContextContract) {
		const trx = await Database.transaction()
		try {
			const params = request.only(['email'])

			if (params.email) {
				const user = await User.query()
					.where('email', params.email)
					.where('is_verified', 0)
					.firstOrFail()

				const token = await this.generateToken(user.id, EmailAction.Verification, trx)
				await this.sendEmail(user, token, EmailAction.Verification)
				await trx.commit()
				return response.status(200).json({
					success: true,
					message: `Successfully sent token to ${user.email}`,
				})
			}
		} catch (error) {
			Logger.error(error)

			if (trx && trx.isTransaction) {
				await trx.rollback()
			}

			return response.status(500).json({
				success: false,
				message: 'Your account is not registered or has active',
				error: error.message,
			})
		}
	}

	/**
	 * Login a user and generate a JWT token.
	 */
	public async login({ request, response, auth }: HttpContextContract) {
		let jwt
		try {
			const data = await request.validate(LoginValidator)

			const user = await User.query()
				.where('email', data.email)
				.where('is_active', 1)
				.preload('roles')
				.first()

			if (user) {
				// check if user has verified or not
				if (!user.is_verified) {
					return response.status(400).json({
						success: false,
						message: 'Your account is not verified yet',
					})
				}

				await auth.use('jwt').attempt(data.email, data.password)

				// generate jwt
				jwt = await auth.use('jwt').generate(user, { payload: user })

				return response.status(200).json({
					success: true,
					message: 'Successfully Login!',
					data: {
						user: user,
						access_token: jwt,
					},
				})
			}
		} catch (error) {
			Logger.error(error)

			return response.status(error.messages ? 400 : 500).json({
				success: false,
				message: 'Combination email & password not match',
				error: error.messages ? error.messages : error.message,
			})
		}
	}

	/**
	 * Forgot password to send token reset password.
	 */
	public async forgotPassword({ request, response }: HttpContextContract) {
		const trx = await Database.transaction()

		try {

			const data = await request.validate(ForgotPasswordValidator)

			const user = await User.query()
				.where('email', data.email)
				.where('is_active', 1)
				.where('is_verified', 1)
				.firstOrFail()

			if (user) {
				// check if user has verified or not
				if (!user.is_verified) {
					return response.status(400).json({
						success: false,
						message: 'Your account is not verified yet',
					})
				}

				const token = await this.generateToken(user.id, EmailAction.ResetPassword, trx)

				await this.sendEmail(user, token, EmailAction.ResetPassword)

				await trx.commit()

				return response.status(200).json({
					success: true,
					message: `Reset password link has been sent to ${data.email}`,
				})
			}
		} catch (error) {

			Logger.error(error)

			await trx.rollback()

			return response.status(error.messages ? 400 : 500).json({
				success: false,
				message: 'Seems your email has not registered in our system',
				error: error.messages ? error.messages : error.message,
			})
		}
	}

	/**
	 * Verify reset token password & update user password.
	 */
	public async updatePassword({ request, response }: HttpContextContract) {
		try {
			const data = await request.validate(UpdatePasswordValidator)

			const apiToken = await ApiToken.query()
				.where('token', data.token)
				.where('expires_at', '>=', DateTime.now().toString())
				.firstOrFail()

			const user = await User.findBy('email', data.email)

			if (user) {
				user.password = data.password

				await user.save()

				await apiToken.delete() // Delete the verification token from the database

				return response.status(200).json({
					success: true,
					message: 'Your password has been updated',
				})
			} else {
				return response.status(404).json({
					success: false,
					message: 'User not found',
				})
			}
		} catch (error) {
			Logger.error(error)

			return response.status(500).json({
				success: false,
				message: 'Failed to activate the account',
				error: error,
			})
		}
	}
}
