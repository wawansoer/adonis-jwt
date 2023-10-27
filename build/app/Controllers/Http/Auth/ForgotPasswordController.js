"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const ForgotPasswordValidator_1 = __importDefault(require("../../../Validators/Auth/ForgotPasswordValidator"));
const User_1 = __importDefault(require("../../../Models/User"));
const AuthService_1 = __importDefault(require("../../../Services/AuthService"));
const Response_1 = require("../../../Interfaces/Response");
class ForgotPasswordController {
    constructor() {
        this.authService = new AuthService_1.default();
    }
    async index({ request, response }) {
        const trx = await Database_1.default.transaction();
        try {
            const data = await request.validate(ForgotPasswordValidator_1.default);
            const user = await User_1.default.query()
                .where('email', data.email)
                .where('is_active', true)
                .firstOrFail();
            if (!user.is_verified) {
                (0, Response_1.Response)(response, 400, false, 'Your account is not verified yet or has been banned');
            }
            const token = await this.authService.generateToken(user.id, 'Reset Password', trx);
            await this.authService.sendEmail(user, token, 'Reset Password');
            await trx.commit();
            (0, Response_1.Response)(response, 200, true, `Reset password link has been sent to ${data.email}`);
        }
        catch (error) {
            Logger_1.default.error(error);
            await trx.rollback();
            (0, Response_1.Response)(response, 404, false, 'Seems your email has not registered in our system', '', error);
        }
    }
}
exports.default = ForgotPasswordController;
//# sourceMappingURL=ForgotPasswordController.js.map