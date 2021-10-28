import { prismaClient } from "../config/primas"

type CreateUserParams = {
  username: string, email: string, password: string
}

class UserRepository {
  async createUser({username, email, password}: CreateUserParams) {
    return await prismaClient.user.create({
      data: {
        username, email, password
      },
      include: this.userInclude()
    })
  }

  async getByUsername(username: string) {
    return await prismaClient.user.findUnique({
      where: { username },
      include: this.userInclude()
    })
  }

  async getById(id: string) {
    return await prismaClient.user.findUnique({
      where: { id },
      include: this.userInclude()
    })
  }

  async getByEmail(email: string) {
    return await prismaClient.user.findUnique({
      where: { email },
      include: this.userInclude()
    })
  }

  private userInclude() {
    return {
      User_permissions: {
        include: {
          permission: {
            select: {
              name: true, description: true, id: true
            }
          }
        }
      },
      User_roles: {
        include: {
          roles: {
            select: {
              name: true, description: true, id: true
            }
          }
        }
      }
    }
  }


}

export {
  UserRepository
}