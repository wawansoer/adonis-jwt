import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import ForgotPasswordValidator from '../../../Validators/Auth/ForgotPasswordValidator'
import User from '../../../Models/User'
import AuthService from '../../../Services/AuthService'
import { Response } from '../../../Interfaces/Response'

export default class ForgotPasswordController {
	private authService: AuthService
	constructor() {
		this.authService = new AuthService()
	}

	/**
	 * Forgot password to send token reset password.
	 */
	public async index({ request, response }: HttpContextContract) {
		const trx = await Database.transaction()

		try {
			const data = await request.validate(ForgotPasswordValidator)
			const user = await User.query()
				.where('email', data.email)
				.where('is_active', true)
				.firstOrFail()

			// check if user has verified and active
			if (!user.is_verified) {
				Response(response, 400, false, 'Your account is not verified yet or has been banned')
			}

			const token = await this.authService.generateToken(user.id, 'Reset Password', trx)
			await this.authService.sendEmail(user, token, 'Reset Password')
			await trx.commit()
			Response(response, 200, true, `Reset password link has been sent to ${data.email}`)
		} catch (error) {
			Logger.error(error)
			await trx.rollback()
			Response(
				response,
				404,
				false,
				'Seems your email has not registered in our system',
				'',
				error
			)
		}
	}
}
