import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import userService from '~/services/user.service'
export const LoginController = (req: Request, res: Response) => {
  console.log(req.body)
  return res.json({
    message: 'Login successful'
  })
}

export const registerController = async (req: Request, res: Response) => {
  const { name, email, date_of_birth, password } = req.body

  if (!name || !email || !date_of_birth || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const user = {
    _id: new ObjectId(),
    name,
    email,
    date_of_birth: new Date(date_of_birth),
    password,
    created_at: new Date(),
    updated_at: new Date(),
    email_verify_token: '', // Token xác thực email sẽ được tạo sau
    forgot_password_token: '', // Token quên mật khẩu sẽ được tạo sau
    verify: 0, // Unverified
    bio: '',
    location: '',
    website: '',
    username: '',
    avatar: '',
    cover_photo: ''
  }

  try {
    const userRs = await userService.createUser(user)
    res.json({ message: 'User registered successfully', userRs })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
