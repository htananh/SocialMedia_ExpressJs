import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/user.service'
import { registerUser, loginUser, logoutUser } from '~/models/requests/user.request'
export const LoginController = async (req: Request<ParamsDictionary, any, loginUser>, res: Response) => {
  const user = req.body
  const result = await userService.login(user.email, user.password)
  return res.json({ message: 'User logged in successfully', result: result })
} 

export const registerController = async (req: Request<ParamsDictionary, any, registerUser>, res: Response) => {
  const user = req.body
  const result = await userService.register(user)
  return res.json({ message: 'User registered successfully', result: result })
}
export const logoutController = async (req: Request<ParamsDictionary, any, logoutUser>, res: Response) => {
  const refreshToken = req.body.refreshToken
  const result = await userService.logout(refreshToken)
  if (result) {
    return res.status(200).json({ message: 'Logged out successfully' })
  } else {
    return res.status(400).json({ message: 'Invalid refresh token' })
  }
}
