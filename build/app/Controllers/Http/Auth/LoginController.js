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
            const user = await User_1.default.query()
                .where('email', data.email)
                .where('is_active', true)
                .preload('roles')
                .preload('userDetail')
                .firstOrFail();
            if (user.is_verified) {
                await auth.use('jwt').attempt(data.email, data.password);
                jwt = await auth.use('jwt').login(user, { payload: { user: user } });
                return response.status(200).json({
                    success: true,
                    data: {
                        user: user,
                        access_token: jwt,
                    },
                    message: 'Successfully Login!',
                });
            }
            else {
                (0, Response_1.Response)(response, 400, false, 'Your account is not verified');
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            (0, Response_1.Response)(response, 404, false, 'Combination email & password not match', '', error);
        }
    }
}
exports.default = LoginController;
//# sourceMappingURL=LoginController.js.map