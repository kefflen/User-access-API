import { ITokenVerificator } from "../ports/ITokenVerificator";
import { IUserRepository } from "../repositories/IUserRepository";


export class UpdateUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenVerificator: ITokenVerificator
  ) {}
}