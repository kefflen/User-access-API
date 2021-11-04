import { Express } from "express"
import { permissionRouter } from "./routes/permissionRouter"
import { userRouter } from "./routes/userRouter"

export const setupRoutes =  (app: Express) => {
  app.use('/users', userRouter)
  app.use('/permissions', permissionRouter)
}

