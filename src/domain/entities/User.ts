import { Permission } from './Permission'

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}

export class UserPermissions extends User {
  #permissions: Permission[]
  constructor(id: string, username: string, email: string, password: string, permissions: Permission[] =[]) {
    super(id, username, email, password)
    this.#permissions = this.ensureUniqueOccurrence(permissions)
  }
  
  hasPermissionName(permissionName: string) {
    return this.permissionsNames.includes(permissionName)
  }

  private ensureUniqueOccurrence(permissionsArr: Permission[]) {
    const occurrenceIds = new Set<string>()
    const result = []
    for (let permission of permissionsArr) {
      const { id } = permission
      const notHasOccurrenceId = !occurrenceIds.has(id)
      if (notHasOccurrenceId) {
        occurrenceIds.add(id)
        result.push(permission)
      }
    }
    
    return result
  }

  get permissions() {
    return this.#permissions
  }
  
  get permissionsNames() {
    return this.#permissions.map(permission => permission.name)
  }
}
