import { AppError } from "../../errors/AppError";
import { UserRepository } from "../../repositories/UserRepository";
import { JwtAuthToken } from "../../utils/JwtAuthToken";
import { TokenVerificator } from "../../utils/TokenVerificator";


export class LoginWithUsernameUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenVerificator: TokenVerificator,
    private readonly jwtAuthToken: JwtAuthToken
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