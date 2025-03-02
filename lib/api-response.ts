type ApiResponse<T> = {
  data?: T
  error?: string
  status: number
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    status: 200,
  }
}

export function errorResponse(message: string, status = 500): ApiResponse<never> {
  return {
    error: message,
    status,
  }
}

