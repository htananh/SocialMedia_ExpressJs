import { Request, Response, NextFunction } from 'express'
import { CustomError, ValidationEntiryError } from '../models/customErrors'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationEntiryError) {
    console.log(err.errors)
    return res.status(err.status).json({ message: err.message, errors: err.errors })
  }
  if (err instanceof CustomError) {
    return res.status(err.status).json({ message: err.message })
  }
  res.status(500).json({ message: 'Internal server error' })
}
