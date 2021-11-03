import { Permission, User } from "../entities";
import { AppError } from "../errors/AppError";
import { IPermissionRepository } from "../repositories/IPermissionRepository";
import { IRoleRepository } from "../repositories/IRoleRepository";
import { IUserRepository } from "../repositories/IUserRepository";

type handleParams = {
  username: string
}

export class GetPermissionsByUsernameService {
  constructor(
    private readonly permissionRepository: IPermissionRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute({ username }: handleParams) {
    const user = await this.userRepository.getByUsername(username)
    if (!user) throw new AppError("There is no user with this usename", 404)
    const rolesPermissions: Permission[] = await this.getPermissionFromUserRoles(user);

    const userPermissions = await this.permissionRepository.getByUser(user)
    const inheritedFromRoles= this.ensureUniqueOccurrence(rolesPermissions)

    return {
      userPermissions, inheritedFromRoles
    }
  }

  private async getPermissionFromUserRoles(user: User) {
    const roles = await this.roleRepository.getByUser(user);
    const rolesPermissions: Permission[] = [];
    for (let role of roles) {
      rolesPermissions.concat(await this.permissionRepository.getByRole(role));
    }
    return rolesPermissions;
  }

  private ensureUniqueOccurrence(permissions: Permission[]) {
    const alreadyCollectedIds = new Set<string>()
    const result: Permission[] = []
    for (let permission of permissions) {
      const { id } = permission
      if (!alreadyCollectedIds.has(id)) {
        alreadyCollectedIds.add(id)
        result.push(permission)
      }
    }
    return result
  }
}