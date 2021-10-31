import { AppError } from "../../errors/AppError";
import { UserRepository } from "../../repositories/UserRepository";
import { IJwtAuthToken } from "../ports/IJwtAuthToken";
import { ITokenVerificator } from "../ports/ITokenVerificator";


export class LoginWithUsernameUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenVerificator: ITokenVerificator,
    private readonly jwtAuthToken: IJwtAuthToken
  ) {}

  async execute(username: string, password: string) {
    const user = await this.userRepository.getByUsername(username)
    if (!user) throw new AppError("Não existe esse usuario no sistema ou senha invalida", 400)

    const isIncorrectPassword = !(await this.tokenVerificator.verify(password, user.password))
    if (isIncorrectPassword) throw new AppError("Não existe esse usuario no sistema ou senha invalida", 400)

    const userResponse = {id: user.id, username: user.username, email: user.email}
    const token = await this.jwtAuthToken.genJwt(userResponse)
    return {user: userResponse, token}
  }
}