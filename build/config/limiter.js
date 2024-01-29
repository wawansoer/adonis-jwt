"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@adonisjs/limiter/build/config");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.default = (0, config_1.limiterConfig)({
    default: 'db',
    stores: {
        db: {
            client: 'db',
            dbName: Env_1.default.get('MYSQL_DB_NAME'),
            tableName: 'rate_limits',
            connectionName: Env_1.default.get('DB_CONNECTION'),
            clearExpiredByTimeout: true,
        },
    },
});
//# sourceMappingURL=limiter.js.map