import { ResponseContract } from '@ioc:Adonis/Core/Response'

interface ApiResponse<T> {
	success: boolean
	message?: string
	data?: T
	error?: string | Record<string, any>
}

function Response<T>(
	response: ResponseContract,
	status = 200,
	success: boolean,
	message?: string,
	data?: T,
	error?: string | Record<string, any>
): void {
	const responseBody: ApiResponse<T> = {
		success,
		message,
		data,
		error,
	}

	response.status(status).json(responseBody)
}

export { ApiResponse, Response }
