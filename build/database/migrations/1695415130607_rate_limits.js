"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'rate_limits';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.string('key', 255).notNullable().primary();
            table.integer('points', 9).notNullable();
            table.bigint('expire').unsigned();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1695415130607_rate_limits.js.map