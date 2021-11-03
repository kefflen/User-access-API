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
  permissionsNames: string[]
  rolesNames: string[]
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
    
    let permissions: Permission[]
    permissions = await this.permissionsFromNames(permissionsNames)
    let roles: Role[]
    roles = await this.rolesFromNames(rolesNames)

    const user = await this.createUserService.execute({
      username, email, password
    })
    
    const { id } = user
    const permissionIds = permissions.map(permission => permission.id)
    await this.userRepository.addPermissions(id, permissionIds)
    const rolesIds = roles.map(role => role.id)
    await this.userRepository.addRoles(id, rolesIds)


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
}