import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserDetail from '../../Models/UserDetail'
import CreateValidator from '../../Validators/UserDetail/CreateValidator'
import UpdateValidator from '../../Validators/UserDetail/UpdateValidator'

export default class UserDetailsController {
	public async index({ response }: HttpContextContract) {
		const userDetail = await UserDetail.all()
		return response.json(userDetail)
	}

	public async show({ params, response }: HttpContextContract) {
		try {
			const userDetail = await UserDetail.query().where('user_id', params.id).firstOrFail()
			return response.status(201).json({
				success: true,
				message: 'Successfully get data',
				data: userDetail,
			})
		} catch (e) {
			return response.status(404).json({
				success: false,
				message: 'Failed get user data',
				error: e,
			})
		}
	}

	public async store({ request, response }: HttpContextContract) {
		try {
			const data = await request.validate(CreateValidator)
			const userDetail = await UserDetail.create(data)
			return response.status(201).json({
				success: true,
				message: 'Successfully saved data',
				data: userDetail,
			})
		} catch (e) {
			return response.status(404).json({
				success: false,
				message: 'Failed saved user data',
				error: e,
			})
		}
	}

	public async update({ params, request, response }: HttpContextContract) {
		try {
			const userDetail = await UserDetail.findOrFail(params.id)

			const data = await request.validate(UpdateValidator)

			userDetail.merge(data)
			await userDetail.save()

			return response.status(200).json({
				success: true,
				message: 'Successfully updated data',
				data: userDetail,
			})
		} catch (e) {
			return response.status(400).json({
				success: false,
				message: 'Failed update user data',
				error: e,
			})
		}
	}

	public async destroy({ params, response }: HttpContextContract) {
		try {
			const userDetail = await UserDetail.findOrFail(params.id)
			await userDetail.delete()
			return response.status(200).json({
				success: true,
				message: 'Successfully deleted data',
				data: userDetail,
			})
		} catch (e) {
			return response.status(400).json({
				success: false,
				message: 'failed deleted data',
				error: e,
			})
		}
	}
}
