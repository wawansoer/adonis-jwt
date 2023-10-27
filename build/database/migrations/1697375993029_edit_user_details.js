"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'user_details';
    }
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('nik', 16).nullable().alter();
            table.string('nama_lengkap', 45).nullable().alter();
            table.date('tanggal_lahir').nullable().alter();
            table.string('alamat', 150).nullable().alter();
            table.string('nomor_handphone', 13).nullable().alter();
            table.string('pengalaman', 45).nullable().alter();
            table.string('status', 15).nullable().alter();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1697375993029_edit_user_details.js.map