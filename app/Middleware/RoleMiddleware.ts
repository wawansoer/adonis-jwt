import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoleMiddleware {
	public async handle({ response, auth }: HttpContextContract, next: () => Promise<void>, allowedRoles : string[]) {
		try {

			await auth.use('jwt').authenticate()

			const data = auth.use('jwt').payload

			const userRole = data?.user.roles[0].slug

			if(!allowedRoles.includes(userRole)){
				return response.status(401).json({
					success: false,
					message: 'Unauthorized access this resource',
				})
			}

			await next()

		}catch (e) {
			return response.status(401).json({
				success: false,
				message: 'Unauthorized access this resource',
				error : e
			})
		}
	}
}
