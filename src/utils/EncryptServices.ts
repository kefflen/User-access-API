import { IEncryptServices } from "../domain/ports/IEncryptServices";
import bcryptjs from 'bcryptjs'
export class TokenVerificator implements IEncryptServices {
  async verify(password: string, hashedPassword: string) {
    return true
  }
  async encrypt(password: string) {
    return await bcryptjs.hash(password, 10)
  }
}