import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import AuthService from '../../../Services/AuthService'
import RegisterValidator from '../../../Validators/Auth/RegisterValidator'
import Role from '../../../Models/Role'
import Logger from '@ioc:Adonis/Core/Logger'
import { Response } from '../../../Interfaces/Response'

export default class RegisterController {
	private authService: AuthService
	constructor() {
		this.authService = new AuthService()
	}

	/**
	 * Register a new user.
	 */
	public async index({ request, response }: HttpContextContract) {
		const trx = await Database.transaction()

		try {
			const role = await Role.query().where('slug', 'guest').firstOrFail()
			const data = await request.validate(RegisterValidator)
			const user = await this.authService.createUser(
				data.email,
				data.password,
				data.username,
				trx
			)
			await this.authService.createUserRole(user.id, role.id, trx)
			const token = await this.authService.generateToken(user.id, 'Account Verification', trx)
			await this.authService.sendEmail(user, token, 'Account Verification')
			await trx.commit()
			Response(
				response,
				true,
				'Successfully registered. Please confirm email to login!',
				'',
				'',
				201
			)
		} catch (error) {
			Logger.error(error)
			if (trx && trx.isTransaction) {
				await trx.rollback()
			}

			let errorMessage = error.messages
				? 'Validation failed'
				: 'Failed to send email confirmation'
			Response(
				response,
				false,
				errorMessage,
				error.messages.errors ?? '',
				error,
				error.messages ? 400 : 500
			)
		}
	}
}
