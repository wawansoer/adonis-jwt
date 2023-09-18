import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
	protected tableName = 'users'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid('id').primary().index()
			table.string('email', 255).notNullable().unique().index()
			table.string('username', 100).notNullable().unique().index()
			table.boolean('is_active').notNullable().defaultTo(false)
			table.boolean('is_verified').notNullable().defaultTo(false)
			table.string('password', 180).notNullable()
			table.string('remember_me_token').nullable()

			/**
			 * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true }).notNullable()
			table.timestamp('updated_at', { useTz: true }).notNullable()
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
