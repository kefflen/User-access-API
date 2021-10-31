
export interface IEncryptServices {
  verify(password: string, hashedPassword: string): Promise<boolean>
  encrypt(password: string): Promise<string>
}