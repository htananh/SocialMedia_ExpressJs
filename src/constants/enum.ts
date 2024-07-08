export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}
export enum Token_Type {
  ACCESS_TOKEN,
  REFRESH_TOKEN
}
interface Media {
  url: string
  type: string // video, image
}