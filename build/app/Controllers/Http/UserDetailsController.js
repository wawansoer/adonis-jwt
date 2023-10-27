"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserDetail_1 = __importDefault(require("../../Models/UserDetail"));
const UpdateValidator_1 = __importDefault(require("../../Validators/UserDetail/UpdateValidator"));
const Response_1 = require("../../Interfaces/Response");
class UserDetailsController {
    async index({ response }) {
        const userDetail = await UserDetail_1.default.all();
        return response.json(userDetail);
    }
    async show({ params, response }) {
        try {
            const userDetail = await UserDetail_1.default.query().where('user_id', params.id).firstOrFail();
            (0, Response_1.Response)(response, 200, true, 'Successfully get data', userDetail);
        }
        catch (e) {
            (0, Response_1.Response)(response, 404, false, 'Failed get data', '', e);
        }
    }
    async update({ params, request, response }) {
        try {
            const userDetail = await UserDetail_1.default.query().where('user_id', params.id).firstOrFail();
            const data = await request.validate(UpdateValidator_1.default);
            userDetail.merge(data);
            await userDetail.save();
            (0, Response_1.Response)(response, 200, true, 'Successfully update data', userDetail);
        }
        catch (e) {
            (0, Response_1.Response)(response, 400, false, 'Failed update data', '', e);
        }
    }
}
exports.default = UserDetailsController;
//# sourceMappingURL=UserDetailsController.js.map