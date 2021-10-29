import { NextFunction, Request, Response } from "express";
import { makeRoleRepository } from "../config/factories/makeRoleRepository";
import { makeUserRepository } from "../config/factories/makeUserRepository";


export function can(permissionsRoutes: string[]) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const userRepository = makeUserRepository()
    const { userId } = request.body
    if (!userId) return response.status(401).send('Need to be authorized to access')

    const user = await userRepository.getById(userId)
    if (!user) return response.status(401).send('Need to be authorized to access')

    const permissionsOfUser = user.User_permissions
      .map(userPermission => userPermission.permission.name)
    
    const userRoles = (await user.User_roles)

    let permissionsArr = new Array<string>()
    for (let userRole of userRoles) {
      const rolesId = userRole.rolesId
      const permissions = await getRolePermissions(rolesId)
      permissionsArr.concat(permissions)
    }

    const allPermissions = new Set([...permissionsArr, ...permissionsOfUser])

    const canExecute = permissionsRoutes.some(permission => allPermissions.has(permission))

    if (canExecute) {
      return response.status(200).send('Ok')
      //return next()
    } else {
      return response.status(401).send('Need to be authorized to access')
    }
  }

  async function getRolePermissions(roleId: string) {
    const rolesRepository = makeRoleRepository()
    const rolesPermissions = await rolesRepository.getByIdWithPermissions(roleId)
    return rolesPermissions.map(rolePermission => rolePermission.permission.name)
  }
}