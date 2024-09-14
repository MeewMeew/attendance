import { Request } from 'express'
import { logger } from '../utils/logger'
import morgan from 'morgan'

morgan.token('hostname', (req: Request) => req.hostname);

export const reqlog = morgan(':hostname :method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (msg: string) => logger.info(msg.trim())
  }
})