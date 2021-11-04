import { Request, Response } from "express";
import { GetPermissionsService } from "../domain/services/GetPermissionsServices";

export class GetPermissionsController {
  constructor(
    private readonly getPermissionsService: GetPermissionsService
  ){}
  handle = async (request: Request, response: Response) => {
    let page
    if (request.params.page == undefined) {
      page = 0
    } else {
      page = Number.parseInt(request.params.page)
    }
    if (isNaN(page)) return response.status(400).json({errors: 'page param should be a number'})
    const permissionsPagination = await this.getPermissionsService.execute({ page, qtd: 10})
    if (permissionsPagination.qtd == 0) return response.status(404).json({erros: 'Page not found'})
    return response.status(200).json(permissionsPagination)
  }
}