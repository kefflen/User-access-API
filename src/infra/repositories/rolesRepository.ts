import { prismaClient } from "../../config/primas";
import { Permission, Role, RolePermissions, User } from "../../domain/entities";
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
      where: { id: roleId }
    })
    if (!roleData) return null

    const permissionsData = await prismaClient.roles_permission.findMany({
      where: { rolesId: roleId },
      select: { permission: true}
    })
    
    const permissions = permissionsData
      .map(objWithPermission => objWithPermission.permission)
      .map(permissionData => new Permission(permissionData.id, permissionData.name, permissionData.description, permissionData.created_at))
    
    const { id, name, description, created_at} = roleData
    return new RolePermissions({ id, name, description, createdAt: created_at, permissions})
  }

  async getByPermission(permission: Permission): Promise<Role[]> {
    const rolePermissionData = await prismaClient.roles_permission.findMany({
      where: { permissionId: permission.id },
      select: { roles: true}
    })

    const roles = rolePermissionData
      .map(objWithRoles => objWithRoles.roles)
      .map(roleData => new Role({ id: roleData.id, name: roleData.name, description: roleData.description, createdAt: roleData.created_at}))
    
    return roles
  }

  async getByUser(user: User): Promise<Role[]> {
    const rolePermissionData = await prismaClient.user_roles.findMany({
      where: { userId: user.id },
      select: { roles: true}
    })

    const roles = rolePermissionData
      .map(objWithRoles => objWithRoles.roles)
      .map(roleData => new Role({ id: roleData.id, name: roleData.name, description: roleData.description, createdAt: roleData.created_at}))

    return roles
  }
}

export {
  RolesRepository
}