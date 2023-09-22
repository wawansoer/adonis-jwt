/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for the majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/', async () => {
	return { message: 'This is Adonis 5 Service' }
})

Route.group(() => {
	Route.group(() => {
		Route.post('/register', 'AuthController.register')
		Route.get('/verify-email', 'AuthController.verifyEmail')
		Route.post('/resend-token', 'AuthController.resendToken')
		Route.post('/login', 'AuthController.login')
		Route.post('/forgot-password', 'AuthController.forgotPassword')
		Route.post('/update-password', 'AuthController.updatePassword')
	}).prefix('auth')
})
	.prefix('api/v1/')
	.middleware('throttle:global')


Route.get('health', async ({ response }) => {
	const report = await HealthCheck.getReport()

	return report.healthy
		? response.ok(report)
		: response.badRequest(report)
}).middleware('auth:jwt')
