"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const UpdatePasswordValidator_1 = __importDefault(require("../../../Validators/Auth/UpdatePasswordValidator"));
const ApiToken_1 = __importDefault(require("../../../Models/ApiToken"));
const luxon_1 = require("luxon");
const User_1 = __importDefault(require("../../../Models/User"));
const Response_1 = require("../../../Interfaces/Response");
class UpdatePasswordByTokenController {
    async index({ request, response }) {
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
                (0, Response_1.Response)(response, true, `Congratulation. Your password is updated.`);
            }
            else {
                (0, Response_1.Response)(response, false, `User not found`, '', '', 404);
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            (0, Response_1.Response)(response, false, `Failed to update your password. Make sure you have a correct link`, '', error, 400);
        }
    }
}
exports.default = UpdatePasswordByTokenController;
//# sourceMappingURL=UpdatePasswordByTokenController.js.map