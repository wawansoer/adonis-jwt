import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import { v4 as uuid } from 'uuid'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import { generateRandomString } from '../../Helpers/GenerateRandomString'
import User from '../../Models/User'
import Token from '../../Models/Token'
import RegisterValidator from '../../Validators/Auth/RegisterValidator'
import ForgotPasswordValidator from '../../Validators/Auth/ForgotPasswordValidator'
import ApiToken from '../../Models/ApiToken'

export default class AuthController {
	private async generateEmailConfirmationToken(userId: string) {
		try {
			const token = new ApiToken()
			token.userId = userId
			token.name = 'Email Confirmation'
			// token.type = 'UUID'
			token.token = generateRandomString(64)
			token.expiresAt = DateTime.now().plus({ hours: 1 })

			await token.save()

			return token
		} catch (e) {
			Logger.error(e)
			throw new Error('Failed to generate token')
		}
	}

	private async sendEmailConfirmation(user: User, token: ApiToken) {
		const base_url = Env.get('FRONT_END_URL')
		await Mail.send((message) => {
			message
				.from(Env.get('SMTP_USERNAME'))
				.to(user.email)
				.subject('Account Verification')
				.htmlView('emails/welcome.edge', {
					token: token.token,
					username: user.username,
					url: `${base_url}/verify-email/${user.email}?token=${token.token}`,
				})
		})
	}

	public async register({ request, response }: HttpContextContract) {
		const trx = await Database.transaction()
		try {
			const data = await request.validate(RegisterValidator)

			const user = new User()
			user.email = data.email
			user.password = data.password
			user.username = data.username

			await user.useTransaction(trx).save()

			const token = await this.generateEmailConfirmationToken(user.id)

			await this.sendEmailConfirmation(user, token)

			await trx.commit()

			return response.status(201).json({
				success: true,
				message: 'Successfully registered. Please confirm email to login!',
				user,
			})

		} catch (error) {
			Logger.error(error)

			await trx.rollback()

			return response.status(error.messages ? 400 : 500).json({
				success: false,
				message: error.messages ? 'Validation failed' : 'Failed to send email conformation',
				error: error.messages ? error.messages : error.message,
			})
		}
	}

	public async verifyEmail({ request, response }: HttpContextContract) {
		try {
			const { token, email } = request.only(['token', 'email'])

			const tokenRecord = await Token.query()
				.where('token', token)
				.where('expires_at', '>=', DateTime.now().toString())
				.firstOrFail()

			if (tokenRecord) {
				const user = await User.findBy('email', email)

				if (user) {
					user.is_verified = true
					await user.save()
					return response.status(200).json({
						success: true,
						message: 'Account activated successfully',
					})
				}
			}

			return response.status(404).json({
				success: false,
				message: 'Failed to activate the account',
				data: null,
			})
		} catch (error) {
			// Handle any errors here, log them, and respond accordingly
			Logger.error(error)
			return response.status(404).json({
				success: false,
				message: 'Failed to activate the account',
				data: null,
			})
		}
	}

	public async resendToken({ request, response }: HttpContextContract) {
		const params = request.only(['email'])

		const user = await User.findBy('email', params.email)

		if (user) {
			await this.sendToken(user.id, user.email, user.username)
			return response.status(404).json({
				success: true,
				message: `Successfully sent token to ${user.email}`,
			})
		}

		return response.status(404).json({
			success: false,
			message: 'User not found',
			data: null,
		})
	}

	public async reqTokenResetPassword({ request, response }: HttpContextContract) {
		const params = request.only(['email'])

		const user = await User.findBy('email', params.email)

		if (user) {
			const generate_token = uuid()
			const token = new Token()
			token.userId = user.id
			token.token = generate_token
			token.expiresAt = DateTime.now().plus({ hours: 1 })
			let base_url = Env.get('FRONT_END_URL')

			await Mail.send((message) => {
				message
					.from(`${Env.get('SMTP_USERNAME')}`)
					.to(user.email)
					.subject('Reset Password Request')
					.html(
						`<h3> Hi, ${user.username}</h3>
						<p>
							Please click this
							<a href='${base_url}/reset-password/${user.id}/token/${generate_token}'>Link</a>
							to reset your password
						</p>`
					)
			})

			return response.status(404).json({
				success: true,
				message: `Successfully sent token to ${user.email}`,
			})
		}

		return response.status(404).json({
			success: false,
			message: 'User not found',
			data: null,
		})
	}
	public async updatePassword({ request, response }: HttpContextContract) {
		let data = await request.validate(ForgotPasswordValidator)

		const user = await User.findBy('email', data.email)

		if (!user) {
			return response.status(404).json({
				success: false,
				message: 'User not found',
			})
		}

		return response.status(200).json({
			success: true,
			message: `Verification token have sent to ${user.email} !`,
		})
	}

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
