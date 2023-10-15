import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { JWTTokenContract } from '@ioc:Adonis/Addons/Jwt'
import Logger from '@ioc:Adonis/Core/Logger'
import User from '../../../Models/User'
import LoginValidator from '../../../Validators/Auth/LoginValidator'
import { Response } from '../../../Interfaces/Response'

export default class LoginController {
	/**
	 * Login a user and generate a JWT token.
	 */
	public async index({ request, response, auth }: HttpContextContract) {
		let jwt: JWTTokenContract<User>
		try {
			const data = await request.validate(LoginValidator)

			const user = await User.query()
				.where('email', data.email)
				.where('is_active', true)
				.preload('role')
				.firstOrFail()

			if (user.is_verified) {
				await auth.use('jwt').attempt(data.email, data.password)

				// generate jwt
				jwt = await auth.use('jwt').login(user, { payload: { user: user } })

				Response(response, 200, true, 'Successfully Login!', { user: user, access_token: jwt })
			} else {
				Response(response, 400, false, 'Your account is not verified')
			}
		} catch (error) {
			Logger.error(error)

			Response(response, 404, false, 'Combination email & password not match', '', error)
		}
	}
}
