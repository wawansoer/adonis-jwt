import User from '../Models/User'
import RoleUser from '../Models/RoleUser'
import ApiToken from '../Models/ApiToken'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
enum EmailAction {
	Verification = 'Account Verification',
	ResetPassword = 'Reset Password',
}
export default class AuthService {
	/**
	 * Create a new user and save it to the database.
	 */
	public async createUser(
		email: string,
		password: string,
		username: string,
		trx: any
	): Promise<User> {
		const user = new User()
		user.email = email
		user.password = password
		user.username = username
		return await user.useTransaction(trx).save()
	}

	/**
	 * Insert a new user role and save it to the database.
	 */
	public async createUserRole(user_id: string, role_id: string, trx: any): Promise<RoleUser> {
		const roleUser = new RoleUser()
		roleUser.userId = user_id
		roleUser.roleId = role_id
		return await roleUser.useTransaction(trx).save()
	}

	/**
	 * Generate a verification token for the given user and save it to the database.
	 */
	public async generateToken(userId: string, tokenName: string, trx: any): Promise<ApiToken> {
		const token = new ApiToken()
		token.userId = userId
		token.name = tokenName
		token.type = 'UUID'
		token.token = uuid()
		token.expiresAt = DateTime.now().plus({ hours: 6 })

		await token.useTransaction(trx).save()

		return token
	}

	/**
	 * Send a verification email to the given user with the verification token.
	 */
	public async sendEmail(user: User, token: ApiToken, action: string) {
		let url: string
		let msg: string
		const baseUrl = Env.get('FRONT_END_URL')

		if (action === EmailAction.Verification) {
			url = `${baseUrl}/verify-email?token=${token.token}&email=${user.email}`
			msg = `confirm your email address.`
		} else if (action === EmailAction.ResetPassword) {
			url = `${baseUrl}/update-password?token=${token.token}&email=${user.email}`
			msg = `reset your password.`
		}

		await Mail.send((message) => {
			message
				.from(Env.get('SMTP_USERNAME'))
				.to(user.email)
				.subject(action)
				.htmlView('emails/welcome.edge', {
					username: user.username,
					url: url,
					type_of_action: action,
					message: msg,
					from: Env.get('SMTP_USERNAME'),
				})
		})
	}
}
