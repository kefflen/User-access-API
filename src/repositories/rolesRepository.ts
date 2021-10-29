import { Roles_permission } from ".prisma/client";
import { prismaClient } from "../config/primas";

class RolesRepository {

  async getByIdWithPermissions(id: string) {
    return await prismaClient.roles_permission.findMany({
      where: {rolesId: id},
      include: {
        permission: {
          select: {
            name: true, description: true, created_at: true
          }
        },
        roles: {
          select: {
            name: true, description: true, created_at: true
          }
        }
      }
    })
  }
}

export {
  RolesRepository
}