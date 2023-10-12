import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = 'user_details'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid('id').primary()
			table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique()
			table.string('nik', 16).notNullable()
			table.string('nama_lengkap', 45).notNullable()
			table.date('tanggal_lahir').notNullable()
			table.string('alamat', 150).notNullable()
			table.string('nomor_handphone', 13).notNullable()
			table.string('pengalaman', 45).notNullable()
			table.string('status', 15).notNullable().defaultTo('Calon Karyawan')
			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
