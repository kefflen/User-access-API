import { UserRepository } from "../../repositories/UserRepository";

export function makeUserRepository() {

  return new UserRepository()
}