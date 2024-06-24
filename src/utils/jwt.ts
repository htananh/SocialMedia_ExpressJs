import jwt from 'jsonwebtoken'

export const generateAccesToken = (payload: any) => {
  const secret = process.env.ACCESS_TOKEN_SECRET
  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined')
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: '3h' }, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

export const generateRefreshToken = (payload: any) => {
  const secret = process.env.REFRESH_TOKEN_SECRET
  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined')
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: '1y' }, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}
