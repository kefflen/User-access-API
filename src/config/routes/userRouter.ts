import { Router } from "express";
import { createUserControllerFactory } from "../factories/createUserControllerFactory";

const userRouter = Router()

userRouter.post('', createUserControllerFactory().handle)

export {
  userRouter
}