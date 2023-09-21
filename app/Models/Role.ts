import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { beforeCreate } from '@adonisjs/lucid/build/src/Orm/Decorators'
import User from './User'
import { v4 as uuid } from 'uuid'

export default class Role extends BaseModel {
	@column({ isPrimary: true })
	public id: string

	@column()
	public slug: string

	@column()
	public name: string

	@column()
	public description: string | null

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	// Specify the table name (optional)
	public static table = 'roles'

	@beforeCreate()
	public static async createUUID(model: User) {
		model.id = uuid()
	}
}
