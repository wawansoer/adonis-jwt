import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = 'user_details'

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string('nik', 16).nullable().alter()
			table.string('nama_lengkap', 45).nullable().alter()
			table.date('tanggal_lahir').nullable().alter()
			table.string('alamat', 150).nullable().alter()
			table.string('nomor_handphone', 13).nullable().alter()
			table.string('pengalaman', 45).nullable().alter()
			table.string('status', 15).nullable().alter()
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
