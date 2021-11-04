import { Router } from 'express'
import { MakeGetPermissionsController } from '../factories/makeGetPermissionsController'

const permissionRouter = Router()
permissionRouter.get('/:page?', MakeGetPermissionsController().handle)

export {
  permissionRouter
}