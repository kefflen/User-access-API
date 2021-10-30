import jwt from 'jsonwebtoken'
import { AppError } from '../errors/AppError'

type Payload = {
  username: string,
  id: string,
  email: string
}

export class JwtAuthToken {
  private readonly secret: string
  constructor() {
    let secret = process.env.SECRET
    if (!secret) throw new AppError("Internal error: need auth secret", 500)
    this.secret = secret
  }

  async genJwt(payload: Payload) {
    const token = jwt.sign(payload, this.secret)
    return token
  }

  async verifyToken(token: string) {
    return await jwt.verify(token, this.secret) as Payload
  }
}