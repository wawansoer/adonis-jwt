import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import AuthService from '../../../Services/AuthService'
import RegisterValidator from '../../../Validators/Auth/RegisterValidator'
import Role from '../../../Models/Role'
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
			await this.authService.initUserDetail(user.id, trx)
			const token = await this.authService.generateToken(user.id, 'Account Verification', trx)
			await this.authService.sendEmail(user, token, 'Account Verification')
			await trx.commit()
			Response(response, 201, true, 'Successfully registered. Please confirm email to login!')
		} catch (error) {
			Logger.error(error)
			if (trx && trx.isTransaction) {
				await trx.rollback()
			}
			let errorMessage = error.messages
				? 'Validation failed.'
				: 'Failed to send email confirmation make sure you have a valid email'
			Response(
				response,
				error.messages ? 400 : 500,
				false,
				errorMessage,
				error.messages ? error.messages : '',
				error
			)
		}
	}
}
