import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Find By ID (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to find org by id', async () => {
    const orgResponse = await request(app.server).post('/orgs').send({
      name: 'Find By ID Org',
      email: 'org@mail.com',
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Av. FindById, 500',
      city: 'Belo Horizonte',
      state: 'MG',
    })
    expect(orgResponse.statusCode).toBe(201)

    const sessionResponse = await request(app.server).post('/sessions').send({
      email: 'org@mail.com',
      password: '123456',
    })
    expect(sessionResponse.statusCode).toBe(200)

    const token = sessionResponse.body.token

    const response = await request(app.server)
      .get('/orgs/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.org.email).toBe('org@mail.com')
  })
})
