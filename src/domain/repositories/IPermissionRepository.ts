import { Permission, Role, User } from "../entities";


export interface IPermissionRepository {
  getById(permissionId: string): Promise<Permission|null>
  getByName(permissionName: string): Promise<Permission|null>
  getByRole(role: Role): Promise<Permission[]>
  getByUser(user: User): Promise<Permission[]>
}