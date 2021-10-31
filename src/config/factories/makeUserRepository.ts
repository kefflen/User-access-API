import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserRepository } from "../../infra/repositories/UserRepository";

export function makeUserRepository(): IUserRepository {

  return new UserRepository()
}