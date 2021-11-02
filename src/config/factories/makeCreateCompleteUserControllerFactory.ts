import { CreateCompleteUserController } from "../../controllers/CreateCompleteUserController";
import { CreateCompleteUserService } from "../../domain/services/CreateCompleteUserService";
import { PermissionRepository } from "../../infra/repositories/PermissionRepository";
import { RolesRepository } from "../../infra/repositories/rolesRepository";
import { UserRepository } from "../../infra/repositories/UserRepository";


export function makeCreateUserCompleteControllerFactory() {
  const userRepository = new UserRepository()
  const roleRepository = new RolesRepository()
  const permissionRepository = new PermissionRepository()

  const createCompleteUserService = new CreateCompleteUserService(
    userRepository, permissionRepository, roleRepository
  )
  return new CreateCompleteUserController(createCompleteUserService)
}