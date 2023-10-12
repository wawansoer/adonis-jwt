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

			const user = await User.query().where('email', data.email).preload('roles').firstOrFail()

			if (user.is_verified && user.is_active) {
				await auth.use('jwt').attempt(data.email, data.password)

				// generate jwt
				jwt = await auth.use('jwt').login(user, { payload: { user: user } })

				Response(
					response,
					true,
					'Successfully Login!',
					{ user: user, access_token: jwt },
					'',
					200
				)
			} else {
				Response(
					response,
					false,
					user.is_active ? 'Your account is not verified' : 'Your account has been disable',
					'',
					'',
					user.is_active ? 400 : 404
				)
			}
		} catch (error) {
			Logger.error(error)

			Response(response, false, 'Combination email & password not match', '', error, 404)
		}
	}
}
