import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import User from '../../Models/User'
import Token from '../../Models/Token'
import RegisterValidator from '../../Validators/Auth/RegisterValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import ForgotPasswordValidator from '../../Validators/Auth/ForgotPasswordValidator'
import { v4 as uuid } from 'uuid'

export default class AuthController {
	public async sendToken(user_id: string, user_email: string, user_name: string) {

		const generate_token = uuid()
		const token = new Token()
		token.userId = user_id
		token.token = generate_token
		token.expiresAt = DateTime.now().plus({ hours: 1 })
		let base_url = Env.get('FRONT_END_URL')
		try {
			await token.save()
			await Mail.send((message) => {
				message
					.from(`${Env.get('SMTP_USERNAME')}`)
					.to(user_email)
					.subject('Account Verification')
					.html(
						`<h3> Welcome Aboard  ${user_name}</h3>
						<p>
							Please Confirm Your Email By Click This
							<a href='${base_url}/verify-email/${user_id}/token/${generate_token}'>Link</a>
						</p>`,
					)
			})
		} catch (e) {
			Logger.error(e)
		}
	}

	public async register({ request, response }: HttpContextContract) {

		let data = await request.validate(RegisterValidator)

		const user = new User()
		user.email = data.email
		user.password = data.password
		user.username = data.username
		const trx = await Database.transaction()

		try {
			const data_user = await user.save()
			await this.sendToken(data_user.id, data_user.email, data_user.username)
			await trx.commit()
			return response.status(201).json({
				success: true,
				message: 'Successfully registered. Please confirm email to login!',
				user,
			})
		} catch (e) {
			await trx.rollback()
			Logger.error(e)
			return response.status(500).json({
				success: false,
				message: 'Failed register, please try again !',
				error: e,
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

				if(user) {
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
						</p>`,
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
