import { Router } from 'express'
import { registerController, LoginController } from '~/controllers/users.controller'
import { userMiddleware } from '~/middlewares/users.middlewares'
const userRouter = Router()

userRouter.get('/login', userMiddleware, LoginController)
userRouter.get('/register', registerController)
export default userRouter
