import { Router } from 'express'
import { registerController, LoginController, logoutController } from '~/controllers/users.controller'
import {
  LoginValidator,
  RegisterValidator,
  LogoutValidator,
  AccessTokenValidator
} from '~/middlewares/users.middlewares'
import wrapRequestHandler from '~/utils/handler'
const userRouter = Router()

userRouter.post('/register', RegisterValidator, wrapRequestHandler(registerController))
userRouter.post('/login', LoginValidator, wrapRequestHandler(LoginController))
userRouter.post('/logout', LogoutValidator, AccessTokenValidator, wrapRequestHandler(logoutController))
export default userRouter
