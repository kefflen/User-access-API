import { UserRepository } from "../../repositories/userRepository";

export function makeUserRepository() {

  return new UserRepository()
}