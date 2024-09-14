import * as controller from '../controllers/user.controller'
import authFirst from '../middlewares/authfirst'
import { Router } from 'express'
import { logger } from '../utils/logger'

export const user = mount()
function mount() {
  logger.info('Route /api/:user mounted')
  return Router().use(authFirst)
    .post('/', (req, res) => {
      controller.create(req.body.users)
        .then(data => res.json(data))
        .catch(error => res.status(400).json(error))
    })
    .put('/', (req, res) => {
      controller.update(req.body.user)
        .then(data => res.json(data))
        .catch(error => res.status(400).json(error))
    })
    .delete('/:id', (req, res) => {
      controller.remove(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.status(400).json(error))
    })

}