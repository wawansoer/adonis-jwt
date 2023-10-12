"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const User_1 = __importDefault(require("../../../Models/User"));
const LoginValidator_1 = __importDefault(require("../../../Validators/Auth/LoginValidator"));
const Response_1 = require("../../../Interfaces/Response");
class LoginController {
    async index({ request, response, auth }) {
        let jwt;
        try {
            const data = await request.validate(LoginValidator_1.default);
            const user = await User_1.default.query().where('email', data.email).preload('roles').firstOrFail();
            if (user.is_verified && user.is_active) {
                await auth.use('jwt').attempt(data.email, data.password);
                jwt = await auth.use('jwt').login(user, { payload: { user: user } });
                (0, Response_1.Response)(response, true, 'Successfully Login!', { user: user, access_token: jwt }, '', 200);
            }
            else {
                (0, Response_1.Response)(response, false, user.is_active ? 'Your account is not verified' : 'Your account has been disable', '', '', user.is_active ? 400 : 404);
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            (0, Response_1.Response)(response, false, 'Combination email & password not match', '', error, 404);
        }
    }
}
exports.default = LoginController;
//# sourceMappingURL=LoginController.js.map