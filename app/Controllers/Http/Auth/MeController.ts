import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import { Response } from '../../../Interfaces/Response'

export default class MeController {
	/**
	 * Verify user jwt.
	 * */
	public async index({ auth, response }: HttpContextContract) {
		try {
			await auth.use('jwt').authenticate()
			const userPayloadFromJwt = auth.use('jwt').payload!

			Response(response, 200, true, `Your credential is valid`, userPayloadFromJwt)
		} catch (error) {
			Logger.error(error)
			Response(
				response,
				401,
				false,
				`Your credential is invalid. Please login again.`,
				'',
				error
			)
		}
	}
}
