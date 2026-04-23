import fastify from 'fastify'
import { healthRoute } from './http/controllers/health/routes.js'

export const app = fastify()

app.register(healthRoute)
