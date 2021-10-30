import { prismaClient } from "../config/primas"
import { Permission } from "../domain/entities"
import { User, UserPermissions } from "../domain/entities/User"
import { IUserRepository } from "../domain/repositories/IUserRepository"

type CreateUserParams = {
  username: string, email: string, password: string
}

class UserRepository implements IUserRepository {
  async create({username, email, password}: CreateUserParams) {
    return await prismaClient.user.create({
      data: {
        username, email, password
      }
    })
  }

  async getByUsername(username: string) {
    const userData = await prismaClient.user.findUnique({
      where: { username }
    })
    if (!userData) return null
    return new User(userData.id, userData.username, userData.email, userData.password)
  }

  async getById(id: string) {
    const userData = await prismaClient.user.findUnique({
      where: { id }
    })
    if (!userData) return null
    return new User(userData.id, userData.username, userData.email, userData.password)
  }

  async getByEmail(email: string) {
    const userData = await prismaClient.user.findUnique({
      where: { email }
    })

    if (!userData) return null
    return new User(userData.id, userData.username, userData.email, userData.password)
  }

  async getByIdWithPermissions(dataId: string): Promise<UserPermissions | null> {
    const userDataWithRoleAndPermissions = await prismaClient.user.findUnique({
      where: { id: dataId },
      include: {
        User_permissions: {
          include: {
            permission: true
          }
        },
        User_roles: {
          include: {
            roles: {include: {Roles_permission: {include: {permission: true}}}
            }
          }
        }
      }
    })

    if (!userDataWithRoleAndPermissions) return null
    

    const userPermissions = userDataWithRoleAndPermissions.User_permissions.map(
      userPermission => userPermission.permission
    ).map(permissionData => new Permission(permissionData.id, permissionData.name, permissionData.description, permissionData.created_at))

    const rolesArraysPermissions = userDataWithRoleAndPermissions.User_roles.map(
      userRoles => userRoles.roles.Roles_permission.map(rolePermission => rolePermission.permission)
        .map(permissionData => new Permission(permissionData.id, permissionData.name, permissionData.description, permissionData.created_at))
    )

    const rolesPermissions: Permission[] = []
    for (let rolePermission of rolesArraysPermissions) {
      rolesPermissions.concat(rolePermission)
    }
    const { id, email, username, password } = userDataWithRoleAndPermissions
    return new UserPermissions(id, email, username, password, [...userPermissions, ...rolesPermissions])
  }
}
export {
  UserRepository
}