import { Router } from "express";
import { can } from "../../middleware/accessController";
import { createUserControllerFactory } from "../factories/createUserControllerFactory";
import { makeLoginWithUsernameControllerFactory } from "../factories/makeLoginWithUsernameControllerFactory";

const userRouter = Router()

userRouter.post('', can(['delete_users']), createUserControllerFactory().handle)
userRouter.post('/login', makeLoginWithUsernameControllerFactory().handle)

export {
  userRouter
}