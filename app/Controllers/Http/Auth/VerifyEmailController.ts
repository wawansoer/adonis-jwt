import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Logger from '@ioc:Adonis/Core/Logger'
import ApiToken from '../../../Models/ApiToken'
import User from '../../../Models/User'
import { Response } from '../../../Interfaces/Response'

export default class VerifyEmailController {
	public async index({ request, response }: HttpContextContract) {
		try {
			const { token, email } = request.only(['token', 'email'])
			const apiToken = await ApiToken.query()
				.where('token', token)
				.where('expires_at', '>=', DateTime.now().toString())
				.firstOrFail()
			const user = await User.query().where('email', email).firstOrFail()
			user.is_verified = true
			await user.save()
			await apiToken.delete()
			Response(
				response,
				200,
				true,
				'Congratulation your email has been verified. Please Login !'
			)
		} catch (error) {
			Logger.error(error)
			Response(
				response,
				404,
				false,
				'Your token is expired or you are not registered yet',
				'',
				error
			)
		}
	}
}
