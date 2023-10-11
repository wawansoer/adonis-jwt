"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const AuthService_1 = __importDefault(require("../../../Services/AuthService"));
const RegisterValidator_1 = __importDefault(require("../../../Validators/Auth/RegisterValidator"));
const Role_1 = __importDefault(require("../../../Models/Role"));
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const Response_1 = require("../../../Interfaces/Response");
class RegisterController {
    constructor() {
        this.authService = new AuthService_1.default();
    }
    async index({ request, response }) {
        const trx = await Database_1.default.transaction();
        try {
            const role = await Role_1.default.query().where('slug', 'guest').firstOrFail();
            const data = await request.validate(RegisterValidator_1.default);
            const user = await this.authService.createUser(data.email, data.password, data.username, trx);
            await this.authService.createUserRole(user.id, role.id, trx);
            const token = await this.authService.generateToken(user.id, 'Account Verification', trx);
            await this.authService.sendEmail(user, token, 'Account Verification');
            await trx.commit();
            (0, Response_1.Response)(response, true, 'Successfully registered. Please confirm email to login!', '', '', 201);
        }
        catch (error) {
            Logger_1.default.error(error);
            if (trx && trx.isTransaction) {
                await trx.rollback();
            }
            let errorMessage = error.messages
                ? 'Validation failed'
                : 'Failed to send email confirmation';
            (0, Response_1.Response)(response, false, errorMessage, '', error, error.messages ? 400 : 500);
        }
    }
}
exports.default = RegisterController;
//# sourceMappingURL=RegisterController.js.map