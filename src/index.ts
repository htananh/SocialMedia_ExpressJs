import { log } from 'console'
import express from 'express'
import userRouter from './user.router'

const app = express()
const router = express.Router()
const port = 3000

// define the home page route
app.get('/', (req, res) => {
  res.send('Birds home page')
})
// define the about route

app.use('/api', userRouter)

// app.get('/', function (req, res) {
//   res.send('Hello World')
// })

app.listen(port, () => {
  console.log('listening on port 3000')
})

module.exports = router
