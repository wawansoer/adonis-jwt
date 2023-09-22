import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import User from './User'

export default class Role extends BaseModel {
	// Specify the table name (optional)
	public static table = 'roles'

	@column({ isPrimary: true, serializeAs: null })
	public id: string

	@column()
	public slug: string

	@column()
	public name: string

	@column()
	public description: string | null

	@column.dateTime({ autoCreate: true, serializeAs: null })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
	public updatedAt: DateTime

	@beforeCreate()
	public static async createUUID(model: Role) {
		model.id = uuid()
	}

	@manyToMany(() => User)
	public users: ManyToMany<typeof User>
}
