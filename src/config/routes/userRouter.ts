import { Router } from "express";
import { can } from "../../middleware/accessController";
import { ensureAutheticated } from "../../middleware/ensureAuthenticated";
import { makeCreateUserControllerFactory } from "../factories/makeCreateUserControllerFactory";
import { makeLoginWithUsernameControllerFactory } from "../factories/makeLoginWithUsernameControllerFactory";

const userRouter = Router()

userRouter.post('', ensureAutheticated, can(['create_users']), makeCreateUserControllerFactory().handle)
userRouter.post('/login', makeLoginWithUsernameControllerFactory().handle)

export {
  userRouter
}