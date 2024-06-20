import { ObjectId } from 'mongodb'
import User from '~/models/schemas/users.schema.js'
import databaseService from './database.service'

class UserService {
  async createUser(user: User) {
    try {
      const result = await databaseService.users.insertOne(user)
      return result
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Internal server error')
    }
  }
}

const userService = new UserService()
export default userService
