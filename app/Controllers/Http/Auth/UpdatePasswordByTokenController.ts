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

			const apiToken = await ApiToken.query()
				.where('token', data.token)
				.where('expires_at', '>=', DateTime.now().toString())
				.firstOrFail()

			const user = await User.findBy('email', data.email)

			if (user) {
				user.password = data.password

				await user.save()

				await apiToken.delete()

				Response(response, true, `Congratulation. Your password is updated.`)
			} else {
				Response(response, false, `User not found`, '', '', 404)
			}
		} catch (error) {
			Logger.error(error)

			Response(
				response,
				false,
				`Failed to update your password. Make sure you have a correct link`,
				'',
				error,
				400
			)
		}
	}
}
