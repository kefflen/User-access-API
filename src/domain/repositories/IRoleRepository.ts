import { Role } from "../entities/Role";

export interface IRoleRepository {
  getById(id: string): Promise<Role>
  getByName(name: string): Promise<Role>
}