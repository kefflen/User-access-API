import { Permission } from "../entities";


export interface IPermissionRepository {
  getById(id: string): Promise<Permission>
  getByName(name: string): Promise<Permission>
}