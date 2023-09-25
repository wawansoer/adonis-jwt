"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const uuid_1 = require("uuid");
const User_1 = __importDefault(require("../../Models/User"));
const ApiToken_1 = __importDefault(require("../../Models/ApiToken"));
const RegisterValidator_1 = __importDefault(require("../../Validators/Auth/RegisterValidator"));
const RoleUser_1 = __importDefault(require("../../Models/RoleUser"));
const Role_1 = __importDefault(require("../../Models/Role"));
const LoginValidator_1 = __importDefault(require("../../Validators/Auth/LoginValidator"));
const ForgotPasswordValidator_1 = __importDefault(require("../../Validators/Auth/ForgotPasswordValidator"));
const UpdatePasswordValidator_1 = __importDefault(require("../../Validators/Auth/UpdatePasswordValidator"));
var EmailAction;
(function (EmailAction) {
    EmailAction["Verification"] = "Account Verification";
    EmailAction["ResetPassword"] = "Reset Password";
})(EmailAction || (EmailAction = {}));
class AuthController {
    async createUser(email, password, username, trx) {
        const user = new User_1.default();
        user.email = email;
        user.password = password;
        user.username = username;
        return await user.useTransaction(trx).save();
    }
    async createUserRole(user_id, role_id, trx) {
        const roleUser = new RoleUser_1.default();
        roleUser.userId = user_id;
        roleUser.roleId = role_id;
        return await roleUser.useTransaction(trx).save();
    }
    async generateToken(userId, tokenName, trx) {
        const token = new ApiToken_1.default();
        token.userId = userId;
        token.name = tokenName;
        token.type = 'UUID';
        token.token = (0, uuid_1.v4)();
        token.expiresAt = luxon_1.DateTime.now().plus({ hours: 1 });
        await token.useTransaction(trx).save();
        return token;
    }
    async sendEmail(user, token, action) {
        let url;
        let msg;
        const baseUrl = Env_1.default.get('FRONT_END_URL');
        if (action === EmailAction.Verification) {
            url = `${baseUrl}/verify-email?token=${token.token}&$email=${user.email}`;
            msg = `Tap the button below to confirm your email address. If you didn't create an account, you can safely delete this email.`;
        }
        else if (action === EmailAction.ResetPassword) {
            url = `${baseUrl}/forgot-password?token=${token.token}&$email=${user.email}`;
            msg = `Tap the button below to reset your password. If you didn't request reset your password, you can safely delete this email.`;
        }
        await Mail_1.default.send((message) => {
            message
                .from(Env_1.default.get('SMTP_USERNAME'))
                .to(user.email)
                .subject(action)
                .htmlView('emails/welcome.edge', {
                username: user.username,
                url: url,
                type_of_action: action,
                message: msg,
                from: Env_1.default.get('SMTP_USERNAME'),
            });
        });
    }
    async register({ request, response }) {
        const trx = await Database_1.default.transaction();
        try {
            const data = await request.validate(RegisterValidator_1.default);
            const user = await this.createUser(data.email, data.password, data.username, trx);
            const role = await Role_1.default.query().where('slug', 'guest').firstOrFail();
            await this.createUserRole(user.id, role.id, trx);
            const token = await this.generateToken(user.id, EmailAction.Verification, trx);
            await this.sendEmail(user, token, EmailAction.Verification);
            await trx.commit();
            return response.status(201).json({
                success: true,
                message: 'Successfully registered. Please confirm email to login!',
                user,
            });
        }
        catch (error) {
            Logger_1.default.error(error);
            if (trx && trx.isTransaction) {
                await trx.rollback();
            }
            let errorMessage = error.messages
                ? 'Validation failed'
                : 'Failed to send email confirmation';
            return response.status(error.messages ? 400 : 500).json({
                success: false,
                message: errorMessage,
                error: error.messages ? error.messages : error.message,
            });
        }
    }
    async verifyEmail({ request, response }) {
        try {
            const { token, email } = request.only(['token', 'email']);
            const apiToken = await ApiToken_1.default.query()
                .where('token', token)
                .where('expires_at', '>=', luxon_1.DateTime.now().toString())
                .firstOrFail();
            const user = await User_1.default.findBy('email', email);
            if (user) {
                user.is_verified = true;
                await user.save();
                await apiToken.delete();
                return response.status(200).json({
                    success: true,
                    message: 'Account activated successfully',
                });
            }
            else {
                return response.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            return response.status(500).json({
                success: false,
                message: 'Failed to activate the account',
                error: error,
            });
        }
    }
    async resendToken({ request, response }) {
        const trx = await Database_1.default.transaction();
        try {
            const params = request.only(['email']);
            if (params.email) {
                const user = await User_1.default.query()
                    .where('email', params.email)
                    .where('is_verified', 0)
                    .firstOrFail();
                const token = await this.generateToken(user.id, EmailAction.Verification, trx);
                await this.sendEmail(user, token, EmailAction.Verification);
                await trx.commit();
                return response.status(200).json({
                    success: true,
                    message: `Successfully sent token to ${user.email}`,
                });
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            if (trx && trx.isTransaction) {
                await trx.rollback();
            }
            return response.status(500).json({
                success: false,
                message: 'Your account is not registered or has active',
                error: error.message,
            });
        }
    }
    async login({ request, response, auth }) {
        let jwt;
        try {
            const data = await request.validate(LoginValidator_1.default);
            const user = await User_1.default.query()
                .where('email', data.email)
                .where('is_active', 1)
                .preload('roles')
                .first();
            if (user) {
                if (!user.is_verified) {
                    return response.status(400).json({
                        success: false,
                        message: 'Your account is not verified yet',
                    });
                }
                await auth.use('jwt').attempt(data.email, data.password);
                jwt = await auth.use('jwt').login(user, { payload: { user: user } });
                return response.status(200).json({
                    success: true,
                    message: 'Successfully Login!',
                    data: {
                        user: user,
                        access_token: jwt,
                    },
                });
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            return response.status(error.messages ? 400 : 500).json({
                success: false,
                message: 'Combination email & password not match',
                error: error.messages ? error.messages : error.message,
            });
        }
    }
    async forgotPassword({ request, response }) {
        const trx = await Database_1.default.transaction();
        try {
            const data = await request.validate(ForgotPasswordValidator_1.default);
            const user = await User_1.default.query()
                .where('email', data.email)
                .where('is_active', 1)
                .where('is_verified', 1)
                .firstOrFail();
            if (user) {
                if (!user.is_verified) {
                    return response.status(400).json({
                        success: false,
                        message: 'Your account is not verified yet',
                    });
                }
                const token = await this.generateToken(user.id, EmailAction.ResetPassword, trx);
                await this.sendEmail(user, token, EmailAction.ResetPassword);
                await trx.commit();
                return response.status(200).json({
                    success: true,
                    message: `Reset password link has been sent to ${data.email}`,
                });
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            await trx.rollback();
            return response.status(error.messages ? 400 : 500).json({
                success: false,
                message: 'Seems your email has not registered in our system',
                error: error.messages ? error.messages : error.message,
            });
        }
    }
    async updatePassword({ request, response }) {
        try {
            const data = await request.validate(UpdatePasswordValidator_1.default);
            const apiToken = await ApiToken_1.default.query()
                .where('token', data.token)
                .where('expires_at', '>=', luxon_1.DateTime.now().toString())
                .firstOrFail();
            const user = await User_1.default.findBy('email', data.email);
            if (user) {
                user.password = data.password;
                await user.save();
                await apiToken.delete();
                return response.status(200).json({
                    success: true,
                    message: 'Your password has been updated',
                });
            }
            else {
                return response.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            return response.status(500).json({
                success: false,
                message: 'Failed to activate the account',
                error: error,
            });
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map