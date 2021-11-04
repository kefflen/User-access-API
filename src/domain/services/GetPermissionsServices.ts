import { AppError } from '../errors/AppError'
import { IPermissionRepository } from '../repositories/IPermissionRepository'

type executeParams = {
  page: number, qtd: number
}
export class GetPermissionsService {
  constructor(
    private readonly permissionRepository: IPermissionRepository
  ) {}
  async execute({ page, qtd}: executeParams) {
    if (qtd > 100) throw new AppError("Can´t take more than 100 items at once", 400)
    if (qtd < 0) throw new AppError("Page should be positive", 400)
    const offset = page * qtd
    const permissions = await this.permissionRepository.getPermissions(offset, qtd)
    return {
      permissions, page, qtd: permissions.length
    }
  }
}