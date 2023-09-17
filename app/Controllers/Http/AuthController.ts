import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { DateTime } from 'luxon'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger';
import User from '../../Models/User';
import Token from '../../Models/Token';
import RegisterValidator from '../../Validators/Auth/RegisterValidator';
export default class AuthController {
  public async register({ request, response }: HttpContextContract) {

    let data = await request.validate(RegisterValidator)

    const user = new User()
    user.email = data.email
    user.password = data.password
    user.username = data.username

    try {
      const data_user = await user.save()
      await this.send_token(data_user.id, data_user.email)
      return response.status(201).json({
        success : true,
        message : 'Successfully registered. Please confirm email to login!'
      })
    }catch (e){
      Logger.error(e);
      return response.status(500).json({
        success : false,
        message : 'Failed register, please try again ',
        error : e,
      })
    }
  }

  public async send_token (user_id : string, user_email : string){
    const generate_token = Math.random().toString(36).substring(7);
    const token = new Token()
    token.userId = user_id
    token.token = generate_token
    token.expiresAt = DateTime.now().plus({hours: 6})


    try {
      await token.save()

      await Mail.send((message) => {
        message
          .from('wawan.bennington@gmail.com')
          .to(user_email)
          .subject('Account Verification')
          .html(generate_token)
      })
    }catch (e) {
      Logger.error(e);
    }
  }
  public async login({ request, auth }: HttpContextContract) {
    const data = request.only(['email', 'password'])
    const user = await User.findBy('email', data.email)

    Logger.info(`${user.rememberMeToken}`)

    const users = {
      user : user,
      role : 'admin'
    }

    let jwt
    if(user) {
      jwt = await auth.use("jwt").generate(user, {payload : users});
    }
    return jwt
  }
}
