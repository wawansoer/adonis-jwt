"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const Response_1 = require("../../../Interfaces/Response");
class MeController {
    async index({ auth, response }) {
        try {
            await auth.use('jwt').authenticate();
            const userPayloadFromJwt = auth.use('jwt').payload;
            (0, Response_1.Response)(response, 200, true, `Your credential is valid`, userPayloadFromJwt);
        }
        catch (error) {
            Logger_1.default.error(error);
            (0, Response_1.Response)(response, 401, false, `Your credential is invalid. Please login again.`, '', error);
        }
    }
}
exports.default = MeController;
//# sourceMappingURL=MeController.js.map