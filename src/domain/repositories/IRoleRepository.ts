import { Permission, User } from "../entities";
import { Role, RolePermissions } from "../entities/Role";

export interface IRoleRepository {
  getById(roleId: string): Promise<Role|null>
  getByName(roleName: string): Promise<Role|null>
  getByIdWithPermissions(roleId: string): Promise<RolePermissions|null>
  getByPermission(permission: Permission): Promise<Role[]>
  getByUser(user: User): Promise<Role[]>
  addPermissions(roleId: string, permissionsIds: string[]): Promise<RolePermissions|null>
  removePermissions(roleId: string, permissionsIds: string[]): Promise<RolePermissions|null>
  allRolesIdsExist(rolesIds: string[]): Promise<boolean>
}