import { prismaClient } from "../../config/primas";
import { Permission, Role, RolePermissions } from "../../domain/entities";
import { IRoleRepository } from "../../domain/repositories/IRoleRepository";

class RolesRepository implements IRoleRepository {

  async getById(roleId: string){
    const roleData = await prismaClient.roles.findUnique({
      where: {id: roleId}
    })
    if (!roleData) return null
    const { id, name, description, created_at } = roleData
    return new Role({id, name, description, createdAt: created_at})
  }

  async getByName(roleName: string) {
    const roleData = await prismaClient.roles.findUnique({
      where: { name: roleName}
    })
    if (!roleData) return null
    const { id, name, description, created_at } = roleData
    return new Role({ id, name, description, createdAt: created_at })
  }

  async getByIdWithPermissions(roleId: string){
    const roleData = await prismaClient.roles.findUnique({
      where: { id: roleId}
    })
    if (!roleData) return null

    const rolePermissionsArr = await prismaClient.roles_permission.findMany({
      where: {rolesId: roleId},
      include: {
        permission: {
          select: {
            name: true, description: true, created_at: true, id: true
          }
        }
      }
    })

    const permissions: Permission[] = []
    for (let rolesPermissionData of rolePermissionsArr) {
      const permission = rolesPermissionData.permission
      permissions.push(new Permission(permission.id, permission.name, permission.description, permission.created_at))
    }

    const { id, name, description, created_at } = roleData
    return new RolePermissions({id, name, description, createdAt: created_at, permissions})
  }
}

export {
  RolesRepository
}