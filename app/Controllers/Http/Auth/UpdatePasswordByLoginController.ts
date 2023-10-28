import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import { Response } from '../../../Interfaces/Response'

export default class UpdatePasswordByLoginController {
	public async index({ request, response, auth }: HttpContextContract) {
		try {
			const data = request.only(['password', 'newPassword'])

			const user = auth.user

			const isValid = await user?.validatePassword(data.password)

			if (isValid && user) {
				user.password = data.newPassword
				user.save()
				Response(response, 200, true, 'Successfully update your password')
			} else {
				Response(response, 400, false, 'Your current password is not valid')
			}
		} catch (error) {
			Logger.error(error)
			Response(response, 404, false, 'Something wrong please try again')
		}
	}
}
