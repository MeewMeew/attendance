import { Router } from 'express'
import { nanoid } from 'nanoid'

import { fakeEnv } from '../controllers/misc.controller'
import { logger } from '../utils/logger'

export const misc = mount()
function mount() {
  logger.info('Route /* | /misc mounted')
  return Router()
    .get(/.*?(\.env).*?/, (_, res) => {
      res.set('Content-Type', 'text/plain')
      res.send(fakeEnv())
    })
    .all('*', (_, res) => {
      res.json({
        code: 200,
        rid: nanoid(),
      })
    })
}
