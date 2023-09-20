import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
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
		username: schema.string({ trim: true }, [
			rules.maxLength(50),
			rules.minLength(3),
			rules.unique({ table: 'users', column: 'username' }),
			rules.notIn(['admin', 'super', 'moderator', 'public', 'dev', 'alpha', 'mail']),
			rules.alphaNum({
				allow: ['underscore'],
			}),
		]),
		email: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'email' })]),
		password: schema.string({}, [rules.minLength(8)]),
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
		alphaNum: "{{ field }} can't contain space & dash",
	}
}
