import e, { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import userService from '~/services/user.service'
import { CustomError } from '~/models/customErrors'
import HttpStatus from '~/constants/HttpStatus'
import { ValidationEntiryError } from '~/models/customErrors'
export const RegisterValidator = checkSchema({
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
        const isEmailExists = await userService.checkEmailExists(value)
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
      errorMessage: 'Date of birth is invalid'
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

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  const errorObj = errors.mapped()
  const validateEntiryError = new ValidationEntiryError({ errors: {} })
  for (const key in errorObj) {
    const msg = errorObj[key].msg
    if (msg instanceof CustomError && msg.status !== HttpStatus.UNPROCESSABLE_ENTITY) {
      console.log({ errors: { [key]: msg.message } })
      return next(msg)
    }
    validateEntiryError.errors[key] = errorObj[key]
  }
  if (!errors.isEmpty()) {
    return next(validateEntiryError)
  }
  next()
}
