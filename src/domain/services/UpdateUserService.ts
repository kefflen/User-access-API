import { AppError } from "../../errors/AppError";
import { IEncryptServices } from "../ports/IEncryptServices";
import { IUserRepository } from "../repositories/IUserRepository";

type UpdateUserParams = {
  id: string,
  username: string,
  password: string,
  rolesNames: string[],
  permissionsNames: string[]
}

export class UpdateUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptServices: IEncryptServices
  ) {}

  async execute(updateUserParams: UpdateUserParams) {
    const { id, password } = updateUserParams
    const originalUser = await this.userRepository.getById(id)
    if (!originalUser) throw new AppError("User not found or incorrect password", 401)

    const notValidPassword = !(await this.encryptServices.verify(password, originalUser.password))
    if (notValidPassword) throw new AppError("User not found or incorrect password", 401)

    const hashed_password = this.encryptServices.encrypt(password)


  }
}