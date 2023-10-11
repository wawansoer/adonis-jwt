"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const User_1 = __importDefault(require("../../../Models/User"));
const AuthService_1 = __importDefault(require("../../../Services/AuthService"));
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
                    .where('is_verified', 0)
                    .firstOrFail();
                const token = await this.authService.generateToken(user.id, 'Account Verification', trx);
                await this.authService.sendEmail(user, token, 'Account Verification');
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
}
exports.default = ResendTokenController;
//# sourceMappingURL=ResendTokenController.js.map