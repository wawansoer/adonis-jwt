import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { beforeCreate } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { v4 as uuid } from 'uuid'

export default class RoleUser extends BaseModel {
	public static table = 'role_user'

	@column({ isPrimary: true })
	public id: string

	@column()
	public roleId: string

	@column()
	public userId: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@beforeCreate()
	public static async createUUID(model: RoleUser) {
		model.id = uuid()
	}
}
