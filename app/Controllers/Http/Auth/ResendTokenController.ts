import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import User from '../../../Models/User'
import AuthService from '../../../Services/AuthService'
import { Response } from '../../../Interfaces/Response'

export default class ResendTokenController {
	private authService: AuthService
	constructor() {
		this.authService = new AuthService()
	}
	/**
	 * Resend the verification token to the user's email.
	 */
	public async index({ request, response }: HttpContextContract) {
		const trx = await Database.transaction()
		try {
			const params = request.only(['email'])

			if (params.email) {
				const user = await User.query()
					.where('email', params.email)
					.where('is_active', true)
					.where('is_verified', false)
					.firstOrFail()

				const token = await this.authService.generateToken(user.id, 'Account Verification', trx)
				await this.authService.sendEmail(user, token, 'Account Verification')
				await trx.commit()
				Response(response, 200, true, `Successfully sent token to ${user.email}`)
			}
		} catch (error) {
			Logger.error(error)

			if (trx && trx.isTransaction) {
				await trx.rollback()
			}
			const msg =
				error.responseCode === 550
					? 'You have invalid email address'
					: 'Your account is not registered or has active'
			Response(response, error.responseCode === 550 ? 500 : 404, false, msg, '', error)
		}
	}
}
