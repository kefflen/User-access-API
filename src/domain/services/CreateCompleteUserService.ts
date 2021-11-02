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

    if (permissionsNames) {
      const currentPermissions = (await this.permissionRepository.getByUser(user)).map(permission => ({name: permission.name, permissionId: permission.id}))
      const currentPermissionNames = currentPermissions.map(permission => permission.name)
      const { plus, minus } = this.differencesBetween(currentPermissionNames, permissionsNames)
      const plusPermissionIds = await this.permissionIdFromNames(plus)
      const minusPermissionIds = await this.permissionIdFromNames(minus)

      await this.userRepository.addPermissions(user.id, plusPermissionIds)
      await this.userRepository.removePermissions(user.id, minusPermissionIds)
    }

    if (rolesNames) {
      const currentRoles = (await this.roleRepository.getByUser(user)).map(permission => ({name: permission.name, permissionId: permission.id}))
      const currentRolesNames = currentRoles.map(permission => permission.name)
      const { plus, minus } = this.differencesBetween(currentRolesNames, rolesNames)
      const plusRolesIds = await this.rolesIdFromNames(plus)
      const minusRolesIds = await this.rolesIdFromNames(minus)

      await this.userRepository.addRoles(user.id, plusRolesIds)
      await this.userRepository.removeRoles(user.id, minusRolesIds)
    }
  }

  private async permissionIdFromNames(names: string[]) {
    const result: string[] = []
    for (let name of names) {
      const permissionData = await this.permissionRepository.getByName(name)
      if (!permissionData) throw new AppError("Was passed a invalid permission name", 400)
      result.push(permissionData.id)
    }
    return result
  }

  private async rolesIdFromNames(names: string[]) {
    const result: string[] = []
    for (let name of names) {
      const permissionData = await this.roleRepository.getByName(name)
      if (!permissionData) throw new AppError("was passed a invalid role name", 400)
      result.push(permissionData.id)
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