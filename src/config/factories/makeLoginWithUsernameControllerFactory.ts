import { LoginWithUsernameUserController } from "../../controllers/LoginWithUsernameController";
import { UserRepository } from "../../repositories/UserRepository";
import { LoginWithUsernameUserService } from "../../services/LoginWithUsernameUserService";
import { TokenVerificator } from "../../utils/TokenVerificator";

export function makeLoginWithUsernameControllerFactory() {
  const repository = new UserRepository()
  const service = new LoginWithUsernameUserService(repository, new TokenVerificator())
  const controller =  new LoginWithUsernameUserController(service)
  return controller
}