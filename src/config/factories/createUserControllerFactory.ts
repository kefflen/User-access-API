import { CreateUserController } from "../../controllers/CreateUserController"
import { UserRepository } from "../../repositories/userRepository"
import { CreateUserService } from "../../services/CreateUserService"

export const createUserControllerFactory = () => {
  const userRepository = new UserRepository()
  const createUserService = new CreateUserService(userRepository)
  return new CreateUserController(createUserService)
}
