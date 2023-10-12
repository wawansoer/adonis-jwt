"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserDetail_1 = __importDefault(require("../../Models/UserDetail"));
const CreateValidator_1 = __importDefault(require("../../Validators/UserDetail/CreateValidator"));
const UpdateValidator_1 = __importDefault(require("../../Validators/UserDetail/UpdateValidator"));
class UserDetailsController {
    async index({ response }) {
        const userDetail = await UserDetail_1.default.all();
        return response.json(userDetail);
    }
    async show({ params, response }) {
        try {
            const userDetail = await UserDetail_1.default.query().where('user_id', params.id).firstOrFail();
            return response.status(201).json({
                success: true,
                message: 'Successfully get data',
                data: userDetail,
            });
        }
        catch (e) {
            return response.status(404).json({
                success: false,
                message: 'Failed get user data',
                error: e,
            });
        }
    }
    async store({ request, response }) {
        try {
            const data = await request.validate(CreateValidator_1.default);
            const userDetail = await UserDetail_1.default.create(data);
            return response.status(201).json({
                success: true,
                message: 'Successfully saved data',
                data: userDetail,
            });
        }
        catch (e) {
            return response.status(404).json({
                success: false,
                message: 'Failed saved user data',
                error: e,
            });
        }
    }
    async update({ params, request, response }) {
        try {
            const userDetail = await UserDetail_1.default.findOrFail(params.id);
            const data = await request.validate(UpdateValidator_1.default);
            userDetail.merge(data);
            await userDetail.save();
            return response.status(200).json({
                success: true,
                message: 'Successfully updated data',
                data: userDetail,
            });
        }
        catch (e) {
            return response.status(400).json({
                success: false,
                message: 'Failed update user data',
                error: e,
            });
        }
    }
    async destroy({ params, response }) {
        try {
            const userDetail = await UserDetail_1.default.findOrFail(params.id);
            await userDetail.delete();
            return response.status(200).json({
                success: true,
                message: 'Successfully deleted data',
                data: userDetail,
            });
        }
        catch (e) {
            return response.status(400).json({
                success: false,
                message: 'failed deleted data',
                error: e,
            });
        }
    }
}
exports.default = UserDetailsController;
//# sourceMappingURL=UserDetailsController.js.map