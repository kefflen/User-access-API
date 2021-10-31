import { AppError } from "../../errors/AppError";
import { IEncryptServices } from "../ports/IEncryptServices";
import { IJwtAuthToken } from "../ports/IJwtAuthToken";
import { IUserRepository } from "../repositories/IUserRepository";


export class LoginWithUsernameUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptServices: IEncryptServices,
    private readonly jwtAuthToken: IJwtAuthToken
  ) {}

  async execute(username: string, password: string) {
    const user = await this.userRepository.getByUsername(username)
    if (!user) throw new AppError("Não existe esse usuario no sistema ou senha invalida", 400)

    const isIncorrectPassword = !(await this.encryptServices.verify(password, user.password))
    if (isIncorrectPassword) throw new AppError("Não existe esse usuario no sistema ou senha invalida", 400)

    const userResponse = {id: user.id, username: user.username, email: user.email}
    const token = await this.jwtAuthToken.genJwt(userResponse)
    return {user: userResponse, token}
  }
}