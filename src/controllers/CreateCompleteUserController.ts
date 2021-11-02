import { Request, Response } from "express";
import { AppError } from "../domain/errors/AppError";
import { CreateCompleteUserService } from "../domain/services/CreateCompleteUserService";

type BodyParams = {
  email: any | undefined
  password: any | undefined
  username: any | undefined
  permissions: any[] | null
  roles: any[] | null
}

export class CreateCompleteUserController {
  constructor(
    private readonly createUserCompleteService: CreateCompleteUserService
  ) { }
  handle = async (request: Request, response: Response) => {
    const { email, password, username, permissions = null, roles = null } = request.body as BodyParams
    const validations = []
    if (!email) validations.push("Need to pass a valid email")
    if (!password) validations.push("Need to pass a valid password")
    if (!username) validations.push("Need to pass a valid username")

    if (validations.length > 0) return response.status(400).json({ errors: validations })
    try {
      const user = await this.createUserCompleteService.execute({
        email, password, username, permissionsNames: permissions, rolesNames: roles
      })
      return response.status(201).json(user)
    } catch (err) {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json(err.body)
      } else {
        console.log(err)
        return response.status(500).json({ "errors": 'Server error' })
      }
    }
  }
}