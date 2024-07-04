import express from 'express'
import { body, validationResult, ContextRunner, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { omit } from 'lodash'
import HttpStatus from '~/constants/HttpStatus'
import { CustomError, ValidationEntiryError, errorType } from '~/models/customErrors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)

    const errors = validationResult(req)
    const errorObj = errors.mapped()
    const validateEntiryError = new ValidationEntiryError({ errors: {} })
    for (const key in errorObj) {
      const msg = errorObj[key].msg
      if (msg instanceof CustomError && msg.status !== HttpStatus.UNPROCESSABLE_ENTITY) {
        // console.log({ errors: { [key]: msg.message } })
        return next(msg)
      }
      const mappedError = errorObj[key] as Partial<errorType>
      const sanitizedError = omit(mappedError, ['type', 'location']) as errorType

      validateEntiryError.errors[key] = sanitizedError
    }
    if (!errors.isEmpty()) {
      return next(validateEntiryError)
    }
    next()
  }
}
