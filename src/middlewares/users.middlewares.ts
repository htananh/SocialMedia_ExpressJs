import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import databaseService from '~/services/database.service'
import userService from '~/services/user.service'
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
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
