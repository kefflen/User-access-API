import { prismaClient } from "../../config/primas";
import { Permission, Role, User } from "../../domain/entities";
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

  async getByRole(role: Role): Promise<Permission[]> {
    const rolePermissionData = await prismaClient.roles_permission.findMany({
      where: {rolesId: role.id},
      select: {permission: true}
    })

    const permissions = this.permissionFromData(rolePermissionData)
    
      return permissions
  }

  async getByUser(user: User): Promise<Permission[]> {
    const rolesUserData = await prismaClient.user_permissions.findMany({
      where: { userId: user.id},
      select: { permission: true }
    })
    const permissions = this.permissionFromData(rolesUserData)

    return permissions
  }

  async allPermissionIdsExist(permissionsIds: string[]) {
    const permissions = []
    for (let permissionId of permissionsIds) {
      permissions.push(await this.getById(permissionId))
    }
    return permissions.every(Boolean)
  }

  private permissionFromData(rolePermissionData: {permission: {id: string, name: string, description: string, created_at: Date}}[]) {
    return rolePermissionData
      .map(objWithPermission => objWithPermission.permission)
      .map(permissionData => new Permission(permissionData.id, permissionData.name, permissionData.description, permissionData.created_at));
  }
}