import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/user.service'
import { registerUser } from '~/models/requests/user.request'
export const LoginController = (req: Request, res: Response) => {
  console.log(req.body)
  return res.json({
    message: 'Login successful'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, registerUser>, res: Response) => {
  try {
    const user = req.body
    const result = await userService.register(user)
    return res.json({ message: 'User registered successfully', result: result })
  } catch (error) {
    console.error('Error registering user:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
