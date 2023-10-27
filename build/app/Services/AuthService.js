"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const luxon_1 = require("luxon");
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const User_1 = __importDefault(require("../Models/User"));
const RoleUser_1 = __importDefault(require("../Models/RoleUser"));
const ApiToken_1 = __importDefault(require("../Models/ApiToken"));
const UserDetail_1 = __importDefault(require("../Models/UserDetail"));
var EmailAction;
(function (EmailAction) {
    EmailAction["Verification"] = "Account Verification";
    EmailAction["ResetPassword"] = "Reset Password";
})(EmailAction || (EmailAction = {}));
class AuthService {
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
    async initUserDetail(user_id, trx) {
        const userDetail = new UserDetail_1.default();
        userDetail.userId = user_id;
        return await userDetail.useTransaction(trx).save();
    }
    async generateToken(userId, tokenName, trx) {
        const token = new ApiToken_1.default();
        token.userId = userId;
        token.name = tokenName;
        token.type = 'UUID';
        token.token = Helpers_1.string.generateRandom(64);
        token.expiresAt = luxon_1.DateTime.now().plus({ hours: 24 });
        await token.useTransaction(trx).save();
        return token;
    }
    async sendEmail(user, token, action) {
        let url;
        let msg;
        const baseUrl = Env_1.default.get('FRONT_END_URL');
        if (action === EmailAction.Verification) {
            url = `${baseUrl}/verify-email?token=${token.token}&email=${user.email}`;
            msg = `confirm your email address.`;
        }
        else if (action === EmailAction.ResetPassword) {
            url = `${baseUrl}/update-password?token=${token.token}&email=${user.email}`;
            msg = `reset your password.`;
        }
        await Mail_1.default.sendLater((message) => {
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
}
exports.default = AuthService;
//# sourceMappingURL=AuthService.js.map