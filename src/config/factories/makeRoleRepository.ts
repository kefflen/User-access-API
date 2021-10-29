import { RolesRepository } from "../../repositories/rolesRepository";

export function makeRoleRepository() {
  return new RolesRepository()
}