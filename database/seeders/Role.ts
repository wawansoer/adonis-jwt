import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from '../../app/Models/Role'

export default class extends BaseSeeder {
	public async run() {
		// Write your database queries inside the run method
		const rolesData = [
			{
				slug: 'root',
				name: 'Root',
				description: 'Super user for developers, you can do anything with this user role :)',
			},
			{
				slug: 'administrator',
				name: 'Administrator',
				description: 'High Level role that can do CRUD All',
			},
			{
				slug: 'editor',
				name: 'Editor',
				description: 'Middle Level role that can do CRU all',
			},
			{
				slug: 'author',
				name: 'Author',
				description: 'Middle Level role that can do CR all',
			},
			{
				slug: 'contributor',
				name: 'Contributor',
				description: 'Low Level role that can do R all',
			},
			{
				slug: 'guest',
				name: 'Guest',
				description: 'Guest Level role that can do R something',
			},
		]

		for (const roles of rolesData) {
			const role = new Role()
			role.description = roles.description
			role.slug = roles.slug
			role.name = roles.name
			await role.save()
		}
	}
}
