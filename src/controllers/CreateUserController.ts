import { Request, Response } from "express"
import { CreateUserService } from "../services/CreateUserService"


class CreateUserController {
  constructor(
    private readonly createUserServive: CreateUserService
  ) {}

  handle = async (request: Request, response: Response) => {
    const { username, email, password } = request.body
    if (!username) return response.status(400).send("Need to pass a usename valid")
    if (!email) return response.status(400).send("Need to pass a email valid")
    if (!password) return response.status(400).send("Need to pass a password valid")

    const user = await this.createUserServive.execute({username, email, password})
    return response.status(201).json(user)
  }
}

export {
  CreateUserController
}