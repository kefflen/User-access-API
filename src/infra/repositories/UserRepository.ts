import { prismaClient } from "../../config/primas"
import { Permission, Role, User, UserPermissions } from "../../domain/entities"
import { IPermissionRepository } from "../../domain/repositories/IPermissionRepository"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { PermissionRepository } from "./PermissionRepository"
import { RolesRepository } from "./RolesRepository"

type CreateUserParams = {
  username: string, email: string, password: string
}

class UserRepository implements IUserRepository {
  private readonly permissionRepository: IPermissionRepository = new PermissionRepository()
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
    const userData = await prismaClient.user.findUnique({
      where: { id: dataId }
    })

    if (!userData) return null
    const { id, username, email, password } = userData
    const user = new User(id, username, email, password)
    const userPermissions = await this.permissionRepository.getByUser(user)
    const rolesPermissions = await this.getPermissionsOfUserRoles(user, userPermissions)

    const userWithPermissions = new UserPermissions(id, username, email, password, [...userPermissions, ...rolesPermissions])
    return userWithPermissions
  }

  async getByPermission(permission: Permission): Promise<User[]> {
    const userPermissionData = await prismaClient.user_permissions.findMany({
      where: { permissionId: permission.id },
      select: { user: true }
    })

    const users = userPermissionData
      .map(objWithUser => objWithUser.user)
      .map(userData => new User(userData.id, userData.username, userData.email, userData.password))
    
    return users
  }

  async getByRole(role: Role): Promise<User[]> {
    const userPermissionData = await prismaClient.user_roles.findMany({
      where: { rolesId: role.id },
      select: { user: true }
    })

    const users = userPermissionData
      .map(objWithUser => objWithUser.user)
      .map(userData => new User(userData.id, userData.username, userData.email, userData.password))
    
    return users
  }

  async addPermissions(userId: string, permissionsIds: string[]) {
    const allPermissionIdsExist = await this.permissionRepository.allPermissionIdsExist(permissionsIds)
    if (!allPermissionIdsExist) return null

    for (let permissionId of permissionsIds) {
      await prismaClient.user_permissions.create({
        data: {
          userId: userId, permissionId
        },
      })
    }

    return await this.getByIdWithPermissions(userId)
  }

  async removePermissions(userId: string, permissionsIds: string[]) {
    for (let permissionId of permissionsIds) {
      await prismaClient.user_permissions.delete({
        where: { userId_permissionId: {permissionId, userId}}
      })
    }

    return await this.getByIdWithPermissions(userId)
  }

  private async getPermissionsOfUserRoles(user: User, userPermissions: Permission[]) {
    const rolesRepository = new RolesRepository()
    const roles = await rolesRepository.getByUser(user)

    const userPermissionsIdsSet = new Set(userPermissions.map(permission => permission.id))
    const rolesPermissions = await this.getPermissionsFromRoles(roles, userPermissionsIdsSet)
    return rolesPermissions
  }

  private async getPermissionsFromRoles(roles: Role[], alreadyCollectedIds= new Set<string>()): Promise<Permission[]> {
    const result: Permission[] = []
    const permissionIdsSet = new Set(alreadyCollectedIds)
    for (let role of roles) {
      const rolePermissions = await this.permissionRepository.getByRole(role)
      for (let permission of rolePermissions) {
        if (!permissionIdsSet.has(permission.id)) {
          result.push(permission)
          permissionIdsSet.add(permission.id)
        }
      }
    }
    return result
  }

}

export {
  UserRepository
}