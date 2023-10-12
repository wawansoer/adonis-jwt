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
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary();
            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique();
            table.string('nik', 16).notNullable();
            table.string('nama_lengkap', 45).notNullable();
            table.date('tanggal_lahir').notNullable();
            table.string('alamat', 150).notNullable();
            table.string('nomor_handphone', 13).notNullable();
            table.string('pengalaman', 45).notNullable();
            table.string('status', 15).notNullable().defaultTo('Calon Karyawan');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1696776974982_user_details.js.map