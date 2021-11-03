import jwt from 'jsonwebtoken'
import { IJwtAuthToken, UserPayload } from '../../domain/ports/IJwtAuthToken'
import { AppError } from '../../domain/errors/AppError'

export class JwtAuthToken implements IJwtAuthToken {
  private readonly secret: string
  constructor() {
    let secret = process.env.SECRET
    if (!secret) throw new AppError("Internal error: need auth secret", 500)
    this.secret = secret
  }

  async genJwt(payload: UserPayload) {
    const token = jwt.sign(payload, this.secret)
    return token
  }

  async verifyToken(token: string) {
    return await jwt.verify(token, this.secret) as UserPayload
  }
}