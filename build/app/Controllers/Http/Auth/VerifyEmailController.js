"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const ApiToken_1 = __importDefault(require("../../../Models/ApiToken"));
const User_1 = __importDefault(require("../../../Models/User"));
const Response_1 = require("../../../Interfaces/Response");
class VerifyEmailController {
    async index({ request, response }) {
        try {
            const { token, email } = request.only(['token', 'email']);
            const apiToken = await ApiToken_1.default.query()
                .where('token', token)
                .where('expires_at', '>=', luxon_1.DateTime.now().toString())
                .firstOrFail();
            const user = await User_1.default.query().where('email', email).firstOrFail();
            user.is_verified = true;
            await user.save();
            await apiToken.delete();
            (0, Response_1.Response)(response, true, 'Congratulation your email has been verified. Please Login !');
        }
        catch (error) {
            Logger_1.default.error(error);
            (0, Response_1.Response)(response, false, 'Your token is expired or you are not registered yet', '', error, 404);
        }
    }
}
exports.default = VerifyEmailController;
//# sourceMappingURL=VerifyEmailController.js.map