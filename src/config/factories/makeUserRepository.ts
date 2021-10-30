import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserRepository } from "../../repositories/UserRepository";

export function makeUserRepository(): IUserRepository {

  return new UserRepository()
}