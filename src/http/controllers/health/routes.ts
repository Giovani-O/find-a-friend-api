import { app } from '@/app.js'
import { health } from './health.js'

export async function healthRoute() {
  app.get('/health', health)
}
