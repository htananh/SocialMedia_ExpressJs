import { Router } from 'express'
import { registerController, LoginController } from '~/controllers/users.controller'
import { RegisterValidator, validate } from '~/middlewares/users.middlewares'
const userRouter = Router()

// userRouter.get('/login', userSchema, validate, LoginController)
userRouter.get('/register', RegisterValidator, validate, registerController)
export default userRouter
