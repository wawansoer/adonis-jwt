import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { JWTTokenContract } from '@ioc:Adonis/Addons/Jwt'
import Logger from '@ioc:Adonis/Core/Logger'
import User from '../../../Models/User'
import LoginValidator from '../../../Validators/Auth/LoginValidator'
import { Response } from '../../../Interfaces/Response'

export default class LoginController {
	/**
	 * Login a user and generate a JWT token.
	 *
	 * @param request - An object representing the HTTP request.
	 * @param response - An object representing the HTTP response.
	 * @param auth - An object representing the authentication service.
	 * @returns A JSON response with the following structure:
	 *   - success: A boolean indicating whether the login was successful.
	 *   - data: An object containing the user and access token.
	 *   - message: A message indicating the result of the login process.
	 */
	public async index({ request, response, auth }: HttpContextContract) {
		let jwt: JWTTokenContract<User>
		try {
			const data = await request.validate(LoginValidator)

			const user = await User.query()
				.where('email', data.email)
				.where('is_active', true)
				.preload('roles')
				.preload('userDetail')
				.firstOrFail()

			if (user.is_verified) {
				await auth.use('jwt').attempt(data.email, data.password)
				// generate jwt
				jwt = await auth.use('jwt').login(user, { payload: { user: user } })
				// Response(response, 200, true, 'Successfully Login!', { user: user, access_token: jwt })
				return response.status(200).json({
					success: true,
					data: {
						user: user,
						access_token: jwt,
					},
					message: 'Successfully Login!',
				})
			} else {
				Response(response, 400, false, 'Your account is not verified')
			}
		} catch (error) {
			Logger.error(error)

			Response(response, 404, false, 'Combination email & password not match', '', error)
		}
	}
}
