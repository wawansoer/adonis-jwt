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

// example route using default jwt
Route.get('/', async () => {
	return { message: 'This is Adonis 5 Service' }
}).middleware('auth:jwt')

// example route using costume jwt to verified user role
Route.get('health', async ({ response }) => {
	const report = await HealthCheck.getReport()
	return report.healthy ? response.ok(report) : response.badRequest(report)
}).middleware(['roleIn:guest,root'])

Route.group(() => {
	Route.group(() => {
		Route.post('/register', 'Auth/RegisterController.index')
		Route.get('/verify-email', 'Auth/VerifyEmailController.index')
		Route.post('/resend-token', 'Auth/ResendTokenController.index')
		Route.post('/login', 'Auth/LoginController.index')
		Route.post('/forgot-password', 'Auth/ForgotPasswordController.index')
		Route.post('/update-password', 'Auth/Controller.updatePassword')
		Route.get('/me', 'Auth/MeController.index')
	}).prefix('auth')
})
	.prefix('api/v1/')
	.middleware('throttle:global')

Route.group(() => {
	Route.resource('/user-detail', 'UserDetailsController').apiOnly()
})
	.prefix('api/v1')
	.middleware(['auth:jwt', 'throttle:global'])
