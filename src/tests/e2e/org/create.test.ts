import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Create Org (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new org', async () => {
    const uniqueId = randomUUID()
    const response = await request(app.server)
      .post('/orgs')
      .send({
        name: 'New Org',
        email: `neworg+${uniqueId}@mail.com`,
        whatsapp: `(11) 98765-${uniqueId.slice(0, 4)}`,
        password: '123456',
        address: 'Test Street, 123',
        city: 'São Paulo',
        state: 'SP',
      })

    expect(response.statusCode).toBe(201)
  })
})
