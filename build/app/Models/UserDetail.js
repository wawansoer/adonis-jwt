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
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const uuid_1 = require("uuid");
class UserDetail extends Orm_1.BaseModel {
    static async createUUID(model) {
        model.id = (0, uuid_1.v4)();
    }
}
UserDetail.table = 'user_details';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], UserDetail.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserDetail.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserDetail.prototype, "nik", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserDetail.prototype, "nama_lengkap", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", luxon_1.DateTime)
], UserDetail.prototype, "tanggal_lahir", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserDetail.prototype, "alamat", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserDetail.prototype, "nomor_handphone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserDetail.prototype, "pengalaman", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserDetail.prototype, "status", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, serializeAs: null }),
    __metadata("design:type", luxon_1.DateTime)
], UserDetail.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null }),
    __metadata("design:type", luxon_1.DateTime)
], UserDetail.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.beforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserDetail]),
    __metadata("design:returntype", Promise)
], UserDetail, "createUUID", null);
exports.default = UserDetail;
//# sourceMappingURL=UserDetail.js.map