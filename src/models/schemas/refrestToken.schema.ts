import { ObjectId } from 'mongodb'

interface refreshTokenType {
  _id?: ObjectId
  refresh_token: string
  created_at?: Date
  user_id: ObjectId
}
export default class refreshToken {
  _id?: ObjectId
  refresh_token: string
  created_at: Date
  user_id: ObjectId
  constructor({ _id, refresh_token, created_at, user_id }: refreshTokenType) {
    this._id = _id
    this.refresh_token = refresh_token
    this.created_at = created_at || new Date()
    this.user_id = user_id
  }
  get id() {
    return this._id
  }
  get userId() {
    return this.user_id
  }
  get refreshToken() {
    return this.refresh_token
  }
  get createdAt() {
    return this.created_at
  }
}
