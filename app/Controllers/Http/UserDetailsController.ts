import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserDetail from '../../Models/UserDetail'
import UpdateValidator from '../../Validators/UserDetail/UpdateValidator'
import { Response } from '../../Interfaces/Response'

export default class UserDetailsController {
	public async index({ response }: HttpContextContract) {
		const userDetail = await UserDetail.all()
		return response.json(userDetail)
	}

	public async show({ params, response }: HttpContextContract) {
		try {
			const userDetail = await UserDetail.query().where('user_id', params.id).firstOrFail()
			Response(response, 200, true, 'Successfully get data', userDetail)
		} catch (e) {
			Response(response, 404, false, 'Failed get data', '', e)
		}
	}

	public async update({ params, request, response }: HttpContextContract) {
		try {
			const userDetail = await UserDetail.query().where('user_id', params.id).firstOrFail()
			const data = await request.validate(UpdateValidator)
			userDetail.merge(data)
			await userDetail.save()

			Response(response, 200, true, 'Successfully update data', userDetail)
		} catch (e) {
			Response(response, 400, false, 'Failed update data', '', e)
		}
	}
}
