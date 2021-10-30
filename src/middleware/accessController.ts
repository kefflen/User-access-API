import { NextFunction, Request, Response } from "express";
import { makeUserRepository } from "../config/factories/makeUserRepository";


export function can(permissionsRoutes: string[]) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const userRepository = makeUserRepository()
    const { userId } = request
    if (!userId) return response.status(401).send('Need to be logged')

    const user = await userRepository.getByIdWithPermissions(userId)
    if (!user) return response.status(401).send('Need to be authorized to access')

    const canExecute = permissionsRoutes.some(permission => user.hasPermissionName(permission))

    if (canExecute) {
      return next()
    } else {
      return response.status(401).send('Need to be authorized to access')
    }
  }
}