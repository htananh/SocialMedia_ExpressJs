import e, { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import userService from '~/services/user.service'
import { CustomError } from '~/models/customErrors'
import HttpStatus from '~/constants/HttpStatus'
import { ValidationEntiryError } from '~/models/customErrors'
import { validate } from '~/utils/validate'
import { verify } from 'crypto'
import { verifyToken } from '~/utils/jwt'
import dotenv from 'dotenv'
import { JsonWebTokenError } from 'jsonwebtoken'
dotenv.config()
export const LoginValidator = validate(
  checkSchema({
    email: {
      in: ['body'],
      isEmail: {
        errorMessage: 'Email is invalid'
      },
      normalizeEmail: true
    },
    password: {
      in: ['body'],
      isLength: {
        errorMessage: 'Password must be at least 6 characters long',
        options: { min: 6 }
      }
    }
  })
)
export const RegisterValidator = validate(
  checkSchema({
    name: {
      in: ['body'],
      isString: {
        errorMessage: 'Name must be a string'
      },
      notEmpty: {
        errorMessage: 'Name is required'
      },
      trim: true
    },
    email: {
      in: ['body'],
      isEmail: {
        errorMessage: 'Email is invalid'
      },
      custom: {
        options: async (value) => {
          const isEmailExists = await userService.findbyEmail(value)
          if (isEmailExists) {
            throw new Error('Email already exists')
          }
        }
      },
      normalizeEmail: true
    },
    date_of_birth: {
      in: ['body'],
      isISO8601: {
        errorMessage: 'Date of birth is invalid must be isISO8601'
      },
      toDate: true
    },
    password: {
      in: ['body'],
      isLength: {
        errorMessage: 'Password must be at least 6 characters long',
        options: { min: 6 }
      }
    }
  })
)
export const LogoutValidator = validate(
  checkSchema({
    refreshToken: {
      in: ['body'],
      isString: {
        errorMessage: 'refreshToken must be a string'
      },
      notEmpty: {
        errorMessage: 'refreshToken is required'
      },
      custom: {
        options: async (value) => {
          try {
            // Verify the refresh token asynchronously
            const [refreshTokenPayload, refreshTokenExists] = await Promise.all([
              verifyToken(value, process.env.REFRESH_TOKEN_SECRET as string),
              userService.findRefreshToken(value)
            ])

            if (!refreshTokenExists) {
              throw new CustomError('refeshToken not exist or used', HttpStatus.UNAUTHORIZED)
            }

            return true
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new CustomError('Invalid refeshToken', HttpStatus.UNAUTHORIZED)
            }
            throw error
          }
        }
      }
    }
  })
)
export const AccessTokenValidator = validate(
  checkSchema({
    Authorization: {
      in: ['headers'],
      custom: {
        options: async (value: string, { req }) => {
          if (!value) {
            throw new CustomError('Access token is required', HttpStatus.UNAUTHORIZED)
          }
          const accessToken = value.split(' ')[1]
          if (!accessToken) {
            throw new CustomError('Access token is required', HttpStatus.UNAUTHORIZED)
          }
          try {
            await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as string)
          } catch (error) {
            throw new CustomError('access token invalid signature', HttpStatus.UNAUTHORIZED)
          }
          return true
        }
      }
    }
  })
)
// export const validate = (req: Request, res: Response, next: NextFunction) => {
//   const errors = validationResult(req)
//   const errorObj = errors.mapped()
//   const validateEntiryError = new ValidationEntiryError({ errors: {} })
//   for (const key in errorObj) {
//     const msg = errorObj[key].msg
//     if (msg instanceof CustomError && msg.status !== HttpStatus.UNPROCESSABLE_ENTITY) {
//       console.log({ errors: { [key]: msg.message } })
//       return next(msg)
//     }
//     validateEntiryError.errors[key] = errorObj[key]
//   }
//   if (!errors.isEmpty()) {
//     return next(validateEntiryError)
//   }
//   next()
// }
