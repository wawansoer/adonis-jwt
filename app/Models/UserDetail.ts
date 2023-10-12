import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class UserDetail extends BaseModel {
	public static table = 'user_details'

	@column({ isPrimary: true })
	public id: string

	@column()
	public user_id: string

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
}
