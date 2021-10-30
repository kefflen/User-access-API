import { NextFunction, Request, Response } from "express";
import { JwtAuthToken } from "../utils/JwtAuthToken";

export async function ensureAutheticated(request: Request, response: Response, next: NextFunction) {
  const jwtAuthToken = new JwtAuthToken()
  const bearerToken = request.headers.authorization
  if (!bearerToken) return response.status(400).json({ message: "Need to pass a valid token" })

  const [bearer, token, ...others] = bearerToken.split(' ')
  let isInvalid = false
  if (bearer != "Bearer") isInvalid = true
  if (others.length > 0) isInvalid = true
  if (isInvalid) return response.status(400).json({ message: "Need to pass a valid token" })

  const user = await jwtAuthToken.verifyToken(token)
  request.userId = user.id

  next()
}

//request.userId = 'fd188ca4-f089-4a57-bc0b-f2460a7c8623'