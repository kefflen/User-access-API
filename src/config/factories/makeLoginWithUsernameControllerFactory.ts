import { LoginWithUsernameUserController } from "../../controllers/LoginWithUsernameController";
import { LoginWithUsernameUserService } from "../../domain/services/LoginWithUsernameUserService";
import { TokenVerificator } from "../../utils/TokenVerificator";
import { JwtAuthToken } from "../../utils/JwtAuthToken";
import { UserRepository } from "../../infra/repositories/UserRepository";

export function makeLoginWithUsernameControllerFactory() {
  const repository = new UserRepository()
  const service = new LoginWithUsernameUserService(
    repository, new TokenVerificator(),
    new JwtAuthToken()
  )

  const controller = new LoginWithUsernameUserController(service)
  return controller
}