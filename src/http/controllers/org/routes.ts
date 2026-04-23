import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt.js'
import { authenticate } from './authenticate.controller.js'
import { create } from './create.controller.js'
import { fetchByCity } from './fetch-by-city.controller.js'
import { findByEmail } from './find-by-email.controller.js'
import { findById } from './find-by-id.controller.js'
import { refresh } from './refresh.controller.js'

export async function orgRoutes(app: FastifyInstance) {
  app.post('/orgs', create)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)

  app.get('/orgs/me', { onRequest: [verifyJWT] }, findById)
  app.post('/orgs/find-by-email', findByEmail)
  app.post('/orgs/fetch-by-city', fetchByCity)
}
