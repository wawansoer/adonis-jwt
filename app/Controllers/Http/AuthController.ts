import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import { generateRandomString } from '../../Helpers/GenerateRandomString'
import User from '../../Models/User'
import ApiToken from '../../Models/ApiToken'
import RegisterValidator from '../../Validators/Auth/RegisterValidator'


export default class AuthController {
	private async generateToken(userId: string, action: string, trx) {
		try {
			const token = new ApiToken()
			token.userId = userId
			token.name = action
			token.type = 'TOKEN 64'
			token.token = generateRandomString(64)
			token.expiresAt = DateTime.now().plus({ hours: 1 })

			await token.useTransaction(trx).save()

			return token
		} catch (e) {
			Logger.error(e)
			throw new Error('Failed to generate token')
		}
	}

	private async sendEmail(user: User, token: ApiToken, action: string,) {
		const base_url = Env.get('FRONT_END_URL')
		let url, msg

		if (action === 'Account Verification'){
			url = `${base_url}/verify-email?token=${token.token}&$email=${user.email}`
			msg = `Tap the button below to confirm your email address. If you didn't create an account, you can safely delete this email.`
		}else if (action === 'Reset Password'){
			url = `${base_url}/verify-email?token=${token.token}&$email=${user.email}`
			msg = `Tap the button below to reset your password. If you didn't request reset password, you can safely delete this email.`
		}

		await Mail.send((message) => {
			message
				.from(Env.get('SMTP_USERNAME'))
				.to(user.email)
				.subject('Account Verification')
				.htmlView('emails/welcome.edge', {
					username: user.username,
					url: url,
					type_of_action : action,
					message : msg,
					from : Env.get('SMTP_USERNAME')
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

			const token = await this.generateToken(user.id, 'Account Verification',trx, )

			await this.sendEmail(user, token, 'Account Verification')

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

			const tokenRecord = await ApiToken.query()
				.where('token', token)
				.where('expires_at', '>=', DateTime.now().toString())
				.firstOrFail()

			const user = await User.findBy('email', email)

			if (user) {
				user.is_verified = true
				await user.save()

				return response.status(200).json({
					success: true,
					message: 'Account activated successfully',
				})
			}

			return response.status(404).json({
				success: false,
				message: 'User not found or token expired',
			})
		} catch (error) {
			Logger.error(error)

			return response.status(500).json({
				success: false,
				message: 'Failed to activate the account',
				error : error
			})
		}
	}

	// public async resendToken({ request, response }: HttpContextContract) {
	// 	const params = request.only(['email'])
	//
	// 	const user = await User.findBy('email', params.email)
	//
	// 	if (user) {
	// 		await this.sendToken(user.id, user.email, user.username)
	// 		return response.status(404).json({
	// 			success: true,
	// 			message: `Successfully sent token to ${user.email}`,
	// 		})
	// 	}
	//
	// 	return response.status(404).json({
	// 		success: false,
	// 		message: 'User not found',
	// 		data: null,
	// 	})
	// }
	//
	// public async reqTokenResetPassword({ request, response }: HttpContextContract) {
	// 	const params = request.only(['email'])
	//
	// 	const user = await User.findBy('email', params.email)
	//
	// 	if (user) {
	// 		const generate_token = uuid()
	// 		const token = new Token()
	// 		token.userId = user.id
	// 		token.token = generate_token
	// 		token.expiresAt = DateTime.now().plus({ hours: 1 })
	// 		let base_url = Env.get('FRONT_END_URL')
	//
	// 		await Mail.send((message) => {
	// 			message
	// 				.from(`${Env.get('SMTP_USERNAME')}`)
	// 				.to(user.email)
	// 				.subject('Reset Password Request')
	// 				.html(
	// 					`<h3> Hi, ${user.username}</h3>
	// 					<p>
	// 						Please click this
	// 						<a href='${base_url}/reset-password/${user.id}/token/${generate_token}'>Link</a>
	// 						to reset your password
	// 					</p>`
	// 				)
	// 		})
	//
	// 		return response.status(404).json({
	// 			success: true,
	// 			message: `Successfully sent token to ${user.email}`,
	// 		})
	// 	}
	//
	// 	return response.status(404).json({
	// 		success: false,
	// 		message: 'User not found',
	// 		data: null,
	// 	})
	// }
	// public async updatePassword({ request, response }: HttpContextContract) {
	// 	let data = await request.validate(ForgotPasswordValidator)
	//
	// 	const user = await User.findBy('email', data.email)
	//
	// 	if (!user) {
	// 		return response.status(404).json({
	// 			success: false,
	// 			message: 'User not found',
	// 		})
	// 	}
	//
	// 	return response.status(200).json({
	// 		success: true,
	// 		message: `Verification token have sent to ${user.email} !`,
	// 	})
	// }

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
