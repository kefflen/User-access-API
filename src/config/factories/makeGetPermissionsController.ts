import { GetPermissionsController } from "../../controllers/GetPermissionsController";
import { GetPermissionsService } from "../../domain/services/GetPermissionsServices";
import { PermissionRepository } from "../../infra/repositories/PermissionRepository";

export function MakeGetPermissionsController() {
  const permissionRepository = new PermissionRepository()
  const getPermissionsService = new GetPermissionsService(permissionRepository)
  return new GetPermissionsController(getPermissionsService)
}