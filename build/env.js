"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.default = Env_1.default.rules({
    HOST: Env_1.default.schema.string({ format: 'host' }),
    PORT: Env_1.default.schema.number(),
    APP_KEY: Env_1.default.schema.string(),
    APP_NAME: Env_1.default.schema.string(),
    DRIVE_DISK: Env_1.default.schema.enum(['local']),
    NODE_ENV: Env_1.default.schema.enum(['development', 'production', 'test']),
    FRONT_END_URL: Env_1.default.schema.string(),
    DB_CONNECTION: Env_1.default.schema.string(),
    DB_HOST: Env_1.default.schema.string({ format: 'host' }),
    DB_PORT: Env_1.default.schema.number(),
    DB_USER: Env_1.default.schema.string(),
    DB_PASSWORD: Env_1.default.schema.string.optional(),
    DB_NAME: Env_1.default.schema.string(),
    SMTP_HOST: Env_1.default.schema.string({ format: 'host' }),
    SMTP_PORT: Env_1.default.schema.number(),
    SMTP_USERNAME: Env_1.default.schema.string(),
    SMTP_PASSWORD: Env_1.default.schema.string(),
});
//# sourceMappingURL=env.js.map