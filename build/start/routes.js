"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const HealthCheck_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/HealthCheck"));
Route_1.default.get('/', async () => {
    return { message: 'This is Adonis 5 Service' };
}).middleware('auth:jwt');
Route_1.default.get('health', async ({ response }) => {
    const report = await HealthCheck_1.default.getReport();
    return report.healthy ? response.ok(report) : response.badRequest(report);
}).middleware(['roleIn:guest,root']);
Route_1.default.group(() => {
    Route_1.default.group(() => {
        Route_1.default.post('/register', 'Auth/RegisterController.index');
        Route_1.default.get('/verify-email', 'Auth/VerifyEmailController.index');
        Route_1.default.post('/resend-token', 'Auth/ResendTokenController.index');
        Route_1.default.post('/login', 'Auth/LoginController.index');
        Route_1.default.post('/forgot-password', 'Auth/ForgotPasswordController.index');
        Route_1.default.post('/update-password', 'Auth/Controller.updatePassword');
        Route_1.default.get('/me', 'Auth/MeController.index');
    }).prefix('auth');
})
    .prefix('api/v1/')
    .middleware('throttle:global');
Route_1.default.group(() => {
    Route_1.default.resource('/user-detail', 'UserDetailsController').apiOnly();
})
    .prefix('api/v1')
    .middleware(['auth:jwt', 'throttle:global']);
//# sourceMappingURL=routes.js.map