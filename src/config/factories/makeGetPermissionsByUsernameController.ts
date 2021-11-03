import { GetPermissionsByUsernameController } from "../../controllers/GetPermissionsByUsernameController";
import { GetPermissionsByUsernameService } from "../../domain/services/GetPermissionsByUsernameService";
import { PermissionRepository } from "../../infra/repositories/PermissionRepository";
import { RolesRepository } from "../../infra/repositories/rolesRepository";
import { UserRepository } from "../../infra/repositories/UserRepository";

export function makeGetPermissionsByUsername() {
  const permissionRepository = new PermissionRepository()
  const roleRepository = new RolesRepository()
  const userRepository = new UserRepository()
  const getPermissionsByUsernameService = new GetPermissionsByUsernameService(
    permissionRepository, roleRepository, userRepository
  )
  return new GetPermissionsByUsernameController(getPermissionsByUsernameService)
}