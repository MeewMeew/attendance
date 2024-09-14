import { Router } from 'express'
import { nanoid } from 'nanoid'
import { logger } from '../utils/logger'
import { sendNotification, subscribe, unsubscribe } from '../controllers/message.controller'

export const message = mount()

function mount() {
  logger.info('Route /api/message mounted')

  return Router()
    .post('/subscribe', async (req, res) => {
      const done = await subscribe(req.body)
      res.json({ code: done ? 200 : 400, rid: nanoid() })
    })
    .post('/unsubscribe', async (req, res) => {
      const done = await unsubscribe(req.body)
      res.json({ code: done ? 200 : 400, rid: nanoid() })
    })
    .post('/message', async (req, res) => {
      const done = await sendNotification(req.body)
      res.json({ code: done ? 200 : 400, rid: nanoid() })
    })
}