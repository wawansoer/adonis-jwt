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
				.where('is_active', 1)
				.preload('roles')
				.firstOrFail()

			if (user) {
				// check if user has verified or not
				if (!user.is_verified) {
					Response(response, false, 'Your account is not verified yet', '', '', 400)
				}

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
			}
		} catch (error) {
			Logger.error(error)

			Response(response, false, 'Combination email & password not match', '', error, 200)
		}
	}
}
