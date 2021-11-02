import { Permission, Role, UserPermissionsRoles } from "../entities"
import { AppError } from "../errors/AppError"
import { IPermissionRepository } from "../repositories/IPermissionRepository"
import { IRoleRepository } from "../repositories/IRoleRepository"
import { IUserRepository } from "../repositories/IUserRepository"
import { CreateUserService } from "./CreateUserService"

type CreateUserRequest = {
  username: string
  email: string
  password: string
  permissionsNames: string[]|null
  rolesNames: string[]|null
}

export class CreateCompleteUserService {
  createUserService: CreateUserService
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly permissionRepository: IPermissionRepository,
    private readonly roleRepository: IRoleRepository
  ) {
    this.createUserService = new CreateUserService(this.userRepository)
  }

  async execute({ username, email, password, permissionsNames, rolesNames }: CreateUserRequest) {
    const user = await this.createUserService.execute({username, email, password})

    let permissions: Permission[]
    if (permissionsNames) {
      const currentPermissions = (await this.permissionRepository.getByUser(user))
      const currentPermissionNames = currentPermissions.map(permission => permission.name)
      const { plus, minus } = this.differencesBetween(currentPermissionNames, permissionsNames)
      permissions = await this.permissionsFromNames(permissionsNames)
      const plusPermissionIds = permissions
        .filter(permission => plus.includes(permission.name))
        .map(permission => permission.id)
      const minusPermissionIds =  permissions
        .filter(permission => minus.includes(permission.name))
        .map(permission => permission.id)

      await this.userRepository.addPermissions(user.id, plusPermissionIds)
      await this.userRepository.removePermissions(user.id, minusPermissionIds)
    } else permissions = []

    let roles: Role[]
    if (rolesNames) {
      const currentRoles = (await this.roleRepository.getByUser(user))
      const currentRolesNames = currentRoles.map(permission => permission.name)
      const { plus, minus } = this.differencesBetween(currentRolesNames, rolesNames)
      roles = await this.rolesFromNames(rolesNames)
      const plusRolesIds = roles
        .filter(role => plus.includes(role.name))
        .map(role => role.id)
      const minusRolesIds = roles
        .filter(role => minus.includes(role.name))
        .map(role => role.id)

      await this.userRepository.addRoles(user.id, plusRolesIds)
      await this.userRepository.removeRoles(user.id, minusRolesIds)
    } else roles = []

    const { id } = user
    return new UserPermissionsRoles({
      id, email, password, username, permissions, roles
    })
  }

  private async permissionsFromNames(names: string[]) {
    const result: Permission[] = []
    for (let name of names) {
      const permission = await this.permissionRepository.getByName(name)
      if (!permission) throw new AppError("Was passed a invalid permission name", 400)
      result.push(permission)
    }
    return result
  }

  private async rolesFromNames(names: string[]) {
    const result: Role[] = []
    for (let name of names) {
      const role = await this.roleRepository.getByName(name)
      if (!role) throw new AppError("was passed a invalid role name", 400)
      result.push(role)
    }
    return result
  }
  
  private differencesBetween(originalArr: string[], newArr: string[]) {
    const plus = []
    const minus = []
    for (let value of originalArr) {
      if (!originalArr.includes(value)) plus.push(value)
      if (!newArr.includes(value)) minus.push(value)
    }
    return {plus, minus}
  }
}