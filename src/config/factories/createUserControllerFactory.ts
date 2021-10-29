import { CreateUserController } from "../../controllers/CreateUserController"
import { CreateUserService } from "../../services/CreateUserService"
import { makeUserRepository } from "./makeUserRepository"

export const createUserControllerFactory = () => {
  const userRepository = makeUserRepository()
  const createUserService = new CreateUserService(userRepository)
  return new CreateUserController(createUserService)
}
