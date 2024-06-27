import { Router } from 'express'
import { registerController, LoginController } from '~/controllers/users.controller'
import { LoginValidator, RegisterValidator, validate } from '~/middlewares/users.middlewares'
import wrapRequestHandler from '~/utils/handler'
const userRouter = Router()

userRouter.post('/register', RegisterValidator, validate, wrapRequestHandler(registerController))
userRouter.post('/login', LoginValidator, validate, wrapRequestHandler(LoginController))
export default userRouter
