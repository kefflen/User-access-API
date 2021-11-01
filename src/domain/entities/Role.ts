import { Permission } from "."

type RoleParams = {
  id: string, name: string, description: string, createdAt: Date
}
export class Role {
  public readonly id: string
  public readonly createdAt: Date
  public name: string
  public description: string

  constructor({id, name, description, createdAt}: RoleParams) {
    this.id = id
    this.name = name
    this.description = description
    this.createdAt = createdAt
  }
}

type RolePermissionsParams = {
  id: string, name: string, description: string, createdAt: Date
  permissions: Permission[]
}

export class RolePermissions extends Role {
  public permissions: Permission[]
  constructor({ id, name, description, createdAt, permissions}: RolePermissionsParams) {
    super({id, name, description, createdAt})
    this.permissions = permissions
  }
}