import { Request } from 'express'

export function ip(req: Request) {
  return (req.headers['x-forwarded-for'] as string || '127.0.0.1,').split(',')[0]
}