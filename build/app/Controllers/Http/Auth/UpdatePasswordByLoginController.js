"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const Response_1 = require("../../../Interfaces/Response");
class UpdatePasswordByLoginController {
    async index({ request, response, auth }) {
        try {
            const data = request.only(['password', 'newPassword']);
            const user = auth.user;
            const isValid = await user?.validatePassword(data.password);
            if (isValid && user) {
                user.password = data.newPassword;
                user.save();
                (0, Response_1.Response)(response, 200, true, 'Successfully update your password');
            }
            else {
                (0, Response_1.Response)(response, 400, false, 'Your current password is not valid');
            }
        }
        catch (error) {
            Logger_1.default.error(error);
            (0, Response_1.Response)(response, 404, false, 'Something wrong please try again');
        }
    }
}
exports.default = UpdatePasswordByLoginController;
//# sourceMappingURL=UpdatePasswordByLoginController.js.map