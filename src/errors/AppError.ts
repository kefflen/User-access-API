
class AppError {
  message: string
  statusCode: number
  name: string
  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}

export {
  AppError
}