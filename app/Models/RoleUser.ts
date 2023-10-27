import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { beforeCreate } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { v4 as uuid } from 'uuid'
import Role from './Role'
import User from './User'

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

	@belongsTo(() => Role, {
		localKey: 'roleId',
		foreignKey: 'id',
	})
	public role: BelongsTo<typeof Role>

	@belongsTo(() => User, {
		localKey: 'userId',
		foreignKey: 'id',
	})
	public user: BelongsTo<typeof User>
}
