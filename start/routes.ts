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
Route.get('/health', async ({ response }) => {
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
		Route.post('/update-password', 'Auth/UpdatePasswordByTokenController.index')
	}).prefix('auth')

	Route.group(() => {
		Route.get('/me', 'Auth/MeController.index').as('me')

		Route.put('/update-password', 'Auth/UpdatePasswordByLoginController.index').as(
			'update.password.auth'
		)
		// user detail routes
		Route.get('/user-detail', 'UserDetailsController.index')
			.middleware(['roleIn:root'])
			.as('show.all.user.detail')
		Route.get('/user-detail/:id', 'UserDetailsController.show').as('show.user.detail')
		Route.put('/user-detail/:id', 'UserDetailsController.update').as('update.user.detail')
	}).middleware('auth:jwt')
})
	.prefix('api/v1/')
	.middleware('throttle:global')
