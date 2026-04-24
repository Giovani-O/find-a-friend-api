import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt.js'
import { create } from './create.controller.js'
import { fetchByCity } from './fetch-by-city.controller.js'
import { findById } from './find-by-id.controller.js'

export async function petRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJWT] }, create)
  app.get('/pets/:id', findById)
  app.post('/pets/fetch-by-city', fetchByCity)
}