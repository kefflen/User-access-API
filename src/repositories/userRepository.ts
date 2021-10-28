import { prismaClient } from "../config/primas"


class UserRepository {
  async createUser(username: string, email: string, password: string) {
    return await prismaClient.user.create({
      data: {
        username, email, password
      }
    })
  }
}

export {
  UserRepository
}