import { prismaClient } from "../../config/primas";
import { Permission } from "../../domain/entities";
import { IPermissionRepository } from "../../domain/repositories/IPermissionRepository";

export class PermissionRepository implements IPermissionRepository {
  async getById(permissionId: string): Promise<Permission | null> {
    const permissionData = await prismaClient.permission.findUnique({
      where: {id: permissionId}
    })
    if (!permissionData) return null
    const { id, name, description, created_at } = permissionData
    return new Permission(id, name, description, created_at)
  }
  async getByName(permissionName: string): Promise<Permission | null> {
    const permissionData = await prismaClient.permission.findUnique({
      where: { name: permissionName}
    })
    if (!permissionData) return null
    const { id, name, description, created_at } = permissionData
    return new Permission(id, name, description, created_at)
  }

}