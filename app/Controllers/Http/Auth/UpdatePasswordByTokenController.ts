import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import UpdatePasswordValidator from '../../../Validators/Auth/UpdatePasswordValidator'
import ApiToken from '../../../Models/ApiToken'
import { DateTime } from 'luxon'
import User from '../../../Models/User'
import { Response } from '../../../Interfaces/Response'

export default class UpdatePasswordByTokenController {
	/**
	 * Verify reset token password & update user password.
	 */
	public async index({ request, response }: HttpContextContract) {
		try {
			const data = await request.validate(UpdatePasswordValidator)

			const user = await User.query()
				.preload('apiToken', (tokenQuery) => {
					tokenQuery
						.where('token', data.token)
						.where('expires_at', '>=', DateTime.now().toString())
				})
				.where('email', data.email)
				.firstOrFail()

			await ApiToken.query().where('id', user.apiToken[0].id).delete()

			user.password = data.password
			await user.save()

			Response(response, 200, true, `Congratulation. Your password is updated.`, data)
		} catch (error) {
			Logger.error(error)

			Response(
				response,
				400,
				false,
				`Failed to update your password. Make sure you have a correct link`,
				'',
				error
			)
		}
	}
}
