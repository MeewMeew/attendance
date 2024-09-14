import { Router } from 'express';
import { message } from './message.route';
import { misc } from './misc.route';
import { user } from './user.route';
import { utils } from './utils.route';
import { logger } from '../utils/logger';

export const routes = mount()

function mount() {
  logger.info('Route /api mounted');
  return Router()
    .use('/api/instructor', user)
    .use('/api/student', user)
    .use('/api/utils', utils)
    .use('/api/message', message)
    .get('/ping', (_, res) => res.end('pong'))
    .use(misc)
}