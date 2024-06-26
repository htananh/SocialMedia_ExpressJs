import { Request, Response, NextFunction, RequestHandler } from 'express'
const wrapRequestHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
export default wrapRequestHandler
