
class AppError {
  body: any
  statusCode: number
  name: string
  constructor(body: any, statusCode: number) {
    this.body = body;
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}

export {
  AppError
}