"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsConfig = {
    enabled: true,
    origin: (requestOrigin) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://vue.onecodeforlife.my.id',
            'https://carwash.onecodeforlife.my.id',
        ];
        if (allowedOrigins.includes(requestOrigin)) {
            return requestOrigin;
        }
        return false;
    },
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
    headers: true,
    exposeHeaders: [
        'cache-control',
        'content-language',
        'content-type',
        'expires',
        'last-modified',
        'pragma',
    ],
    credentials: true,
    maxAge: 90,
};
exports.default = corsConfig;
//# sourceMappingURL=cors.js.map