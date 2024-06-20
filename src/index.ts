import { log } from 'console'
import express from 'express'
import userRouter from './routers/users.routers'
import databaseServier from './services/database.service'

const app = express()
app.use(express.json())
const router = express.Router()
const port = 3000
databaseServier.connect()
app.get('/', (req, res) => {
  res.send('home page')
})

app.use('/api', userRouter)

app.listen(port, () => {
  console.log('listening on port 3000')
})

module.exports = router
