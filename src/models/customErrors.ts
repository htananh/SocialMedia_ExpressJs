import HttpStatus from '~/constants/HttpStatus'

type errorType = {
  msg: string
  [key: string]: any
}
export class CustomError {
  status: number
  message: string
  constructor(message: string, status: number) {
    this.message = message
    this.status = status
  }
}
export class ValidationEntiryError extends CustomError {
  errors: { [key: string]: errorType }
  constructor({ errors }: { errors: { [key: string]: errorType } }) {
    super('Validation error', HttpStatus.UNPROCESSABLE_ENTITY)
    this.errors = errors
  }
}
