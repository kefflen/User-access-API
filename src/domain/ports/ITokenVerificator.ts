
export interface ITokenVerificator {
  verify(password: string, hashedPassword: string): Promise<boolean>
}