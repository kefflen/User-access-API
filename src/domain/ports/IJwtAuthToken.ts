

export type UserPayload = {
  username: string,
  id: string,
  email: string
}

export interface IJwtAuthToken {
  genJwt(payload: UserPayload) : Promise<string>
  verifyToken(token: string): Promise<UserPayload>
}