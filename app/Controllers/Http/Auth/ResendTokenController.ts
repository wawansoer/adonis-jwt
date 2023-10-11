import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import User from '../../../Models/User'
import AuthService from '../../../Services/AuthService'

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
					.where('is_verified', 0)
					.firstOrFail()

				const token = await this.authService.generateToken(user.id, 'Account Verification', trx)
				await this.authService.sendEmail(user, token, 'Account Verification')
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
}
