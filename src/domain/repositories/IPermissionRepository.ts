import { Permission } from "../entities";


export interface IPermissionRepository {
  getById(permissionId: string): Promise<Permission|null>
  getByName(permissionName: string): Promise<Permission|null>
}