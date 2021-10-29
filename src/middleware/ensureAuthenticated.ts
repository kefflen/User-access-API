import { NextFunction, Request, Response } from "express";

export function ensureAutheticated(request: Request, response: Response, next: NextFunction) {

  request.userId = 'fd188ca4-f089-4a57-bc0b-f2460a7c8623'
  next()

}