"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const authConfig = {
    guard: 'web',
    guards: {
        web: {
            driver: 'session',
            provider: {
                driver: 'lucid',
                identifierKey: 'id',
                uids: ['email'],
                model: () => Promise.resolve().then(() => __importStar(require('../app/Models/User'))),
            },
        },
        api: {
            driver: 'oat',
            tokenProvider: {
                type: 'api',
                driver: 'database',
                table: 'api_tokens',
                foreignKey: 'user_id',
            },
            provider: {
                driver: 'lucid',
                identifierKey: 'id',
                uids: ['email'],
                model: () => Promise.resolve().then(() => __importStar(require('../app/Models/User'))),
            },
        },
        basic: {
            driver: 'basic',
            realm: 'Login',
            provider: {
                driver: 'lucid',
                identifierKey: 'id',
                uids: ['email'],
                model: () => Promise.resolve().then(() => __importStar(require('../app/Models/User'))),
            },
        },
        jwt: {
            driver: 'jwt',
            publicKey: Env_1.default.get('JWT_PUBLIC_KEY', '').replace(/\\n/g, '\n'),
            privateKey: Env_1.default.get('JWT_PRIVATE_KEY', '').replace(/\\n/g, '\n'),
            persistJwt: false,
            jwtDefaultExpire: '5h',
            refreshTokenDefaultExpire: '5h',
            tokenProvider: {
                type: 'api',
                driver: 'database',
                table: 'jwt_tokens',
                foreignKey: 'user_id',
            },
            provider: {
                driver: 'lucid',
                identifierKey: 'id',
                uids: ['email'],
                model: () => Promise.resolve().then(() => __importStar(require('../app/Models/User'))),
            },
        },
    },
};
exports.default = authConfig;
//# sourceMappingURL=auth.js.map