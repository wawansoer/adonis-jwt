import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
	constructor(protected ctx: HttpContextContract) {}

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
	public schema = schema.create({
		nik: schema.string({ trim: true }, [rules.minLength(16)]),
		nama_lengkap: schema.string({ trim: true }, [rules.minLength(10)]),
		tanggal_lahir: schema.date({}),
		alamat: schema.string({ trim: true }, [rules.minLength(10)]),
		nomor_handphone: schema.string({ trim: true }, [rules.minLength(10)]),
		pengalaman: schema.string({ trim: true }, []),
	})

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages: CustomMessages = {
		minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
		maxLength: '{{ field }} must be less then {{ options.maxLength }} characters long',
		required: '{{ field }} is required',
		unique: '{{ field }} must be unique, and this value is already taken',
	}
}
