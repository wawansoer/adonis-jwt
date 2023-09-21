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

const ACTION_ACCOUNT_VERIFICATION = 'Account Verification'

export default class AuthController {
	/**
	 * Create a new user and save it to the database.
	 */
	private async createUser(email: string, password: string, username: string, trx): Promise<User> {
		const user = new User()
		user.email = email
		user.password = password
		user.username = username
		return await user.useTransaction(trx).save()
	}

	/**
	 * Generate a verification token for the given user and save it to the database.
	 */
	private async generateVerificationToken(userId: string, trx): Promise<ApiToken> {
		const token = new ApiToken()
		token.userId = userId
		token.name = ACTION_ACCOUNT_VERIFICATION
		token.type = 'UUID'
		token.token = uuid()
		token.expiresAt = DateTime.now().plus({ hours: 1 })

		await token.useTransaction(trx).save()

		return token
	}

	/**
	 * Send a verification email to the given user with the verification token.
	 */
	private async sendVerificationEmail(user: User, token: ApiToken) {
		const base_url = Env.get('FRONT_END_URL')
		const url = `${base_url}/verify-email?token=${token.token}&$email=${user.email}`
		const msg = `Tap the button below to confirm your email address. If you didn't create an account, you can safely delete this email.`

		await Mail.send((message) => {
			message
				.from(Env.get('SMTP_USERNAME'))
				.to(user.email)
				.subject('Account Verification')
				.htmlView('emails/welcome.edge', {
					username: user.username,
					url: url,
					type_of_action: ACTION_ACCOUNT_VERIFICATION,
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

			const token = await this.generateVerificationToken(user.id, trx)

			await this.sendVerificationEmail(user, token)

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

			await apiToken.delete() // Delete the verification token from the database

			const user = await User.findBy('email', email)

			if (user) {
				user.is_verified = true
				await user.save()

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

				const token = await this.generateVerificationToken(user.id, trx)
				await this.sendVerificationEmail(user, token)
				await trx.commit()
				return response.status(200).json({
					success: true,
					message: `Successfully sent token to ${user.email}`,
				})
			}
		} catch (error) {
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
	public async login({ request, auth }: HttpContextContract) {
		const data = request.only(['email', 'password'])
		const user = await User.findBy('email', data.email)

		const users = {
			user: user,
			role: 'admin',
		}

		let jwt
		if (user) {
			jwt = await auth.use('jwt').generate(user, { payload: users })
		}
		return jwt
	}
}
