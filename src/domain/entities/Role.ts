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