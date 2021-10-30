import { User, UserPermissions } from "../entities/User";

type createUserDTO = {
  username: string, email: string, password: string
}

export interface IUserRepository {
  create({username, email, password}: createUserDTO): Promise<User>
  getByUsername(username: string): Promise<User|null>
  getById(id: string): Promise<User|null>
  getByEmail(email: string): Promise<User|null>
  getByIdWithPermissions(id: string): Promise<UserPermissions|null>
}