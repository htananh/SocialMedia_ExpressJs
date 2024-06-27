import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import { registerUser } from '~/models/requests/user.request'
import User from '~/models/schemas/users.schema'
import { hashPassword, comparePassword } from '~/utils/cryto'
import { generateAccesToken, generateRefreshToken } from '~/utils/jwt'
import { Token_Type } from '~/constants/enum'
import { CustomError, ValidationEntiryError } from '~/models/customErrors'
import refreshToken from '~/models/schemas/refrestToken.schema'
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
  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async register(payload: registerUser) {
    const customErrors = new CustomError('Validation error', 400)
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password),
        created_at: new Date(),
        updated_at: new Date()
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = (await this.signAccessAndRefreshToken(user_id)) as [string, string]

    await databaseService.refreshTokens.insertOne(
      new refreshToken({
        user_id: new ObjectId(user_id),
        refresh_token: refresh_token
      })
    )
    return { access_token, refresh_token }
  }
  async login(email: string, password: string) {
    const user = await databaseService.users.findOne({ email })
    if (!user) {
      throw new CustomError('User not found', 404)
    }
    if (!comparePassword(password, user.password)) {
      throw new CustomError('Password is incorrect', 400)
    }
    const user_id = user._id.toString()
    const [access_token, refresh_token] = (await this.signAccessAndRefreshToken(user_id)) as [string, string]

    await databaseService.refreshTokens.insertOne(
      new refreshToken({
        user_id: new ObjectId(user_id),
        refresh_token: refresh_token
      })
    )
    return { access_token, refresh_token }
  }
  async findbyEmail(email: string) {
    const result = await databaseService.users.findOne({ email })
    return Boolean(result)
  }
}

const userService = new UserService()
export default userService
