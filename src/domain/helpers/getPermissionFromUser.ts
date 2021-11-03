
import { Permission, User } from "../entities";
import { IPermissionRepository } from "../repositories/IPermissionRepository";
import { IRoleRepository } from "../repositories/IRoleRepository";

export class GetPermissionsFromUser {
  constructor(
    private readonly permissionRepository: IPermissionRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(user: User) {
    const rolesPermissions: Permission[] = await this.getPermissionFromUserRoles(user)
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