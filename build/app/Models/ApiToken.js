"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Decorators_1 = require("@adonisjs/lucid/build/src/Orm/Decorators");
const uuid_1 = require("uuid");
const User_1 = __importDefault(require("./User"));
class ApiToken extends Orm_1.BaseModel {
    static async createUUID(model) {
        model.id = (0, uuid_1.v4)();
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], ApiToken.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ApiToken.prototype, "userId", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default),
    __metadata("design:type", Object)
], ApiToken.prototype, "user", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ApiToken.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ApiToken.prototype, "type", void 0);
__decorate([
    (0, Orm_1.column)({ columnName: 'token' }),
    __metadata("design:type", String)
], ApiToken.prototype, "token", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ApiToken.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ApiToken.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.column.dateTime({ columnName: 'expires_at' }),
    __metadata("design:type", Object)
], ApiToken.prototype, "expiresAt", void 0);
__decorate([
    (0, Decorators_1.beforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ApiToken]),
    __metadata("design:returntype", Promise)
], ApiToken, "createUUID", null);
exports.default = ApiToken;
//# sourceMappingURL=ApiToken.js.map