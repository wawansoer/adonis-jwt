"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoleMiddleware {
    async handle({ response, auth }, next, allowedRoles) {
        try {
            await auth.use('jwt').authenticate();
            const data = auth.use('jwt').payload;
            const userRole = data?.user.roles[0].slug;
            if (!allowedRoles.includes(userRole)) {
                return response.status(401).json({
                    success: false,
                    message: 'Unauthorized access this resource',
                });
            }
            await next();
        }
        catch (e) {
            return response.status(401).json({
                success: false,
                message: 'Unauthorized access this resource',
                error: e,
            });
        }
    }
}
exports.default = RoleMiddleware;
//# sourceMappingURL=RoleMiddleware.js.map