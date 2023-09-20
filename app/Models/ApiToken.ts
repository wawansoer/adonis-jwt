import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { beforeCreate } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { v4 as uuid } from 'uuid'
import User from './User'

export default class ApiToken extends BaseModel {
	@column({ isPrimary: true })
	public id: string

	@column()
	public userId: string

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>

	@column()
	public name: string

	@column()
	public type: string

	@column({ columnName: 'token'})
	public token: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@column.dateTime({ columnName: 'expires_at'})
	public expiresAt: DateTime | null

	@beforeCreate()
	public static async createUUID(model: User) {
		model.id = uuid()
	}
}
