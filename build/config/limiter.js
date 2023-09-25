"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@adonisjs/limiter/build/config");
exports.default = (0, config_1.limiterConfig)({
    default: 'db',
    stores: {
        db: {
            client: 'db',
            dbName: 'adonis-v',
            tableName: 'rate_limits',
            connectionName: 'mysql',
            clearExpiredByTimeout: true,
        },
    },
});
//# sourceMappingURL=limiter.js.map