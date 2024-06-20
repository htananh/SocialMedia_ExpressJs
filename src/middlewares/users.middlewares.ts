import { Request, Response, NextFunction } from 'express'
export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (email === '' && password === '') {
    return res.status(400).json({
      message: 'Invalid email or password'
    })
  }
  next()
}
