import { Express } from "express"
import { userRouter } from "./routes/userRouter"

export const setupRoutes =  (app: Express) => {
  app.use('/users', userRouter)
}

