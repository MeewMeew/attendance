import { Request, Response, NextFunction } from 'express';
import { auth } from '../shared/firebase'

export default async function authFirst(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = await auth.verifyIdToken(token)
    if (decodedToken.admin === false) {
      return res.status(403).json({
        code: 403,
        message: 'Permission denied. Only admin can access this route.'
      })
    }
    next()
  } else {
    res.status(401).json({
      code: 401,
      message: 'Unauthorized'
    })
  }
}