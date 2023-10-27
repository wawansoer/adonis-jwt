import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeCreate, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import User from './User'

export default class UserDetail extends BaseModel {
	public static table = 'user_details'

	@column({ isPrimary: true, serializeAs: null })
	public id: string

	@column()
	public userId: string

	@column()
	public nik: string

	@column()
	public nama_lengkap: string

	@column()
	public tanggal_lahir: DateTime

	@column()
	public alamat: string

	@column()
	public nomor_handphone: string

	@column()
	public pengalaman: string

	@column()
	public status: string

	@column.dateTime({ autoCreate: true, serializeAs: null })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
	public updatedAt: DateTime

	@beforeCreate()
	public static async createUUID(model: UserDetail) {
		model.id = uuid()
	}

	@hasOne(() => User)
	public user: HasOne<typeof User>
}
