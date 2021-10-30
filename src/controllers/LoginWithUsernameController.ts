import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { LoginWithUsernameUserService } from "../domain/services/LoginWithUsernameUserService";

class LoginWithUsernameUserController {
  constructor(
    private readonly loginWithUsernameUserService: LoginWithUsernameUserService
  ) {}

  handle = async (request: Request, response: Response) => {
    let { username, password } = request.body
    if (!username) return response.status(400).send("Need to pass username")
    if (!password) return response.status(400).send("Need to pass password")

    try {
      const user = await this.loginWithUsernameUserService.execute(username, password)
      return response.status(200).json(user)
    } catch (err) {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json(err.body)
      } else {
        console.log(err)
        return response.status(500).send('Unknow error')
      }
    }
  }
}

export {
  LoginWithUsernameUserController
}