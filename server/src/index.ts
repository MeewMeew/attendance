import favicon from 'serve-favicon'
import express from 'express'
import https from 'https'
import http from 'http'
import cors from 'cors'

import { logger } from './utils/logger'
import { reqlog } from './middlewares/reqlog'
import { routes } from './routes'

const iconPath = 'public/favicon.ico'

const app = express()
if (await Bun.file(iconPath).exists()) {
  app.use(favicon(iconPath))
}
app.set('json spaces', 2)
app.set('trust proxy', true)
app.disable('x-powered-by')
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || /^https?:\/\/([a-z0-9-]+\.)?mewis\.me$/i.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(reqlog)
app.use(routes)

if (Bun.env.NODE_ENV === 'production') {
  https.createServer({
    key: await Bun.file('certs/key.pem').text(),
    cert: await Bun.file('certs/cert.pem').text()
  }, app).listen(Bun.env.PORT || 443, () => {
    logger.info('Server is running on https://localhost:' + Bun.env.PORT || 443)
  })
} else {
  http.createServer(app).listen(3000, () => {
    logger.info('Server is running on http://localhost:3000')
  })
}