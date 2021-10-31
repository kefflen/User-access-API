import { ITokenVerificator } from "../domain/ports/ITokenVerificator";

export class TokenVerificator implements ITokenVerificator {
  async verify(password: string, hashedPassword: string) {
    return true
  }
}