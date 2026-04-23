import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Find By Email (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to find org by email', async () => {
    await request(app.server).post('/orgs').send({
      name: 'Find By Email Org',
      email: 'findbyemail@mail.com',
      whatsapp: '(41) 95555-4444',
      password: '123456',
      address: 'Rua FindByEmail, 200',
      city: 'Curitiba',
      state: 'PR',
    })

    const response = await request(app.server)
      .post('/orgs/find-by-email')
      .send({
        email: 'findbyemail@mail.com',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.org).toEqual(
      expect.objectContaining({
        email: 'findbyemail@mail.com',
      }),
    )
  })
})
