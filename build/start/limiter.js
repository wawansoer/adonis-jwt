"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLimiters = void 0;
const services_1 = require("@adonisjs/limiter/build/services");
exports.httpLimiters = services_1.Limiter.define('global', () => {
    return services_1.Limiter.allowRequests(180)
        .every('1 min')
        .limitExceeded((error) => {
        error.message = 'Rate limit exceeded';
        error.status = 429;
    })
        .store('db')
        .blockFor('30 min');
}).httpLimiters;
//# sourceMappingURL=limiter.js.map