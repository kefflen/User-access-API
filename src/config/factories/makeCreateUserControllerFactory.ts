import { CreateUserController } from "../../controllers/CreateUserController"
import { CreateUserService } from "../../domain/services/CreateUserService"
import { makeUserRepository } from "./makeUserRepository"

export const makeCreateUserControllerFactory = () => {
  const userRepository = makeUserRepository()
  const createUserService = new CreateUserService(userRepository)
  return new CreateUserController(createUserService)
}
