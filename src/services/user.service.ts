import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { registerUser } from '~/models/requests/user.request'
import User from '~/models/schemas/users.schema'
import { hashPassword } from '~/utils/cryto'
import { generateAccesToken, generateRefreshToken } from '~/utils/jwt'
import { Token_Type } from '~/constants/enum'
class UserService {
  private signAccessToken(user_id: string) {
    return generateAccesToken({
      user_id,
      type: Token_Type.ACCESS_TOKEN
    })
  }
  private signRefreshToken(user_id: string) {
    return generateRefreshToken({
      user_id,
      type: Token_Type.REFRESH_TOKEN
    })
  }
  async register(payload: registerUser) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password),
        created_at: new Date(),
        updated_at: new Date(),
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return { access_token, refresh_token }
  }
  async checkEmailExists(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }
}

const userService = new UserService()
export default userService
