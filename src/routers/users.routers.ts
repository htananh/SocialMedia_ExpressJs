import { Router } from 'express'
import { registerController, LoginController } from '~/controllers/users.controller'
import { RegisterValidator, validate } from '~/middlewares/users.middlewares'
import wrapRequestHandler from '~/utils/handler'
const userRouter = Router()

// userRouter.get('/login', userSchema, validate, LoginController)
userRouter.post('/register', RegisterValidator, validate, wrapRequestHandler(registerController))
export default userRouter
