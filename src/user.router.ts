import { Router } from 'express'
const userRouter = Router()
const timeLog = (req: any, res: any, next: any) => {
  console.log('Time: ', Date.now())
  next()
}
userRouter.use(timeLog)
userRouter.get('/about', (req, res) => {
  res.send('About birds')
})

export default userRouter
