import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/users.schema'

dotenv.config()
console.log('MONGODB_USER:', process.env.MONGODB_USER);
console.log('MONGODB_PASS:', process.env.MONGODB_PASS);
console.log('MONGODB_DATABASE:', process.env.MONGODB_DATABASE);

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@socialmedial.m3vl34w.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=SocialMedial`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.MONGODB_DATABASE)
  }

  async connect() {
    try {
      await this.client.connect()
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw error
    }
  }
  get users(): Collection<User> {
    return this.db.collection('users')
  }
}

const databaseService = new DatabaseService()
export default databaseService
