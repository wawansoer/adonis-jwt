"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const User_1 = __importDefault(require("../../../Models/User"));
const AuthService_1 = __importDefault(require("../../../Services/AuthService"));
const Response_1 = require("../../../Interfaces/Response");
class ResendTokenController {
    constructor() {
        this.authService = new AuthService_1.default();
    }
    async index({ request, response }) {
        const trx = await Database_1.default.transaction();
        try {
            const params = request.only(['email']);
            if (params.email) {
                const user = await User_1.default.query()
                    .where('email', params.email)
                    .where('is_active', true)
                    .where('is_verified', false)
                    .firstOrFail();
                const token = await this.authService.generateToken(user.id, 'Account Verification', trx);
                await this.authService.sendEmail(user, token, 'Account Verification');
                await trx.commit();
                (0, Response_1.Response)(response, 200, true, `Successfully sent token to ${user.email}`);
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            if (trx && trx.isTransaction) {
                await trx.rollback();
            }
            const msg = error.responseCode === 550
                ? 'You have invalid email address'
                : 'Your account is not registered or has active';
            (0, Response_1.Response)(response, error.responseCode === 550 ? 500 : 404, false, msg, '', error);
        }
    }
}
exports.default = ResendTokenController;
//# sourceMappingURL=ResendTokenController.js.map