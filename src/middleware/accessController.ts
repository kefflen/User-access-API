import { NextFunction, Request, Response } from "express";
import { makeUserRepository } from "../config/factories/makeUserRepository";

//TODO Pegar as permissões pelas 'roles'
export function can(permissionsRoutes: string[]) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const userRepository = makeUserRepository()
    const { userId } = request
    if (!userId) return response.status(401).send('Need to be authorized to access')

    const user = await userRepository.getById(userId)
    if (!user) return response.status(401).send('Need to be authorized to access')
    
    const canExecute = user.User_permissions
      .map(userPermission => userPermission.permission.name)
      .some(permission => permissionsRoutes.includes(permission))
    
    if (canExecute) {
      return next()
    } else {
      return response.status(401).send('Need to be authorized to access')
    }
  }
}