import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
	BaseModel,
	beforeSave,
	beforeCreate,
	column,
	manyToMany,
	ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import Role from './Role'

export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: string

	@column()
	public email: string

	@column()
	public username: string

	@column({ serializeAs: null })
	public is_active: boolean

	@column({ serializeAs: null })
	public is_verified: boolean

	@column({ serializeAs: null })
	public password: string

	@column()
	public rememberMeToken: string | null

	@column.dateTime({ autoCreate: true, serializeAs: null })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
	public updatedAt: DateTime

	@beforeSave()
	public static async hashPassword(user: User) {
		if (user.$dirty.password) {
			user.password = await Hash.make(user.password)
		}
	}

	@beforeCreate()
	public static async createUUID(model: User) {
		model.id = uuid()
	}

	@manyToMany(() => Role)
	public roles: ManyToMany<typeof Role>
}
