"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class JwtTokens extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'jwt_tokens';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
            table.string('name').notNullable();
            table.string('type').notNullable();
            table.string('token', 64).notNullable().unique().index();
            table.timestamp('expires_at', { useTz: true }).notNullable();
            table.timestamp('created_at', { useTz: true }).notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = JwtTokens;
//# sourceMappingURL=1694922370536_jwt_tokens.js.map