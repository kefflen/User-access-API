import { Request, Response } from "express";
import { AppError } from "../domain/errors/AppError";
import { GetPermissionsByUsernameService } from "../domain/services/GetPermissionsByUsernameService";


export class GetPermissionsByUsernameController {
  constructor(
    private readonly getPermissionsByUsernameService: GetPermissionsByUsernameService
  ){}
  handle = async (request: Request, response: Response) => {
    const { username } = request.params
    try {
      const permissions = await this.getPermissionsByUsernameService.execute({ username })
      return response.status(200).json(permissions)
    } catch(err) {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json(err.body)
      } else {
        console.log(err)
        return response.status(500).send("Server error")
      }
    }
  }
}