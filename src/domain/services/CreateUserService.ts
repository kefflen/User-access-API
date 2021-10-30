import { AppError } from "../../errors/AppError";
import bcryptjs from 'bcryptjs'
import { IUserRepository } from "../repositories/IUserRepository";

type CreateUserRequest = {
  username: string
  email: string
  password: string
}

class CreateUserService {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}
  async execute({ username, email, password }: CreateUserRequest) {
    const valuesAlreadyUsed = await this.uniqueValuesDoesExist(username, email)
    if (valuesAlreadyUsed.length>0) throw new AppError({messages: valuesAlreadyUsed}, 403)
    const password_token = await bcryptjs.hash(password, 10)

    const user = await this.userRepository.create({username, email, password: password_token})

    return user
  }

  async uniqueValuesDoesExist(username: string, email: string) {
    const exists = []
    const existUsername = await this.userRepository.getByUsername(username)
    const existEmail = await this.userRepository.getByEmail(email)
    if (existEmail) exists.push("Already exist user with this email")
    if (existUsername) exists.push("Already exist user with this username")

    return exists
  }
}

export {
  CreateUserService
}