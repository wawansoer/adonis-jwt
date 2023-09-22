import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = 'role_user'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid('id').primary().unique()
			table.uuid('role_id').index()
			table.foreign('role_id').references('id').inTable('roles').onDelete('cascade')
			table.uuid('user_id').index()
			table.foreign('user_id').references('id').inTable('users').onDelete('cascade')

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
