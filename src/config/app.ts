import express from 'express'
import cors from 'cors'
import { setupRoutes } from './routes'
import dotenv from 'dotenv'
dotenv.config()


const app = express()
app.use(cors())
app.use(express.json())

setupRoutes(app)

export {
  app
}