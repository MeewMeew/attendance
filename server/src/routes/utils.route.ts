import { Router } from "express";
import { logger } from "../utils/logger";
import { ip } from "../utils/ip";

export const utils = mount()
function mount() {
  logger.info('Route /api/utils mounted')
  return Router().get('/whatismyip', (req, res) => {
    logger.info('GET /api/utils/whatismyip')
    res.send(ip(req))
  })
}