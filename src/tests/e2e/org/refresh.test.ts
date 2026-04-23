import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Refresh Token (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh token', async () => {
    await request(app.server).post('/orgs').send({
      name: 'Refresh Org',
      email: 'org@mail.com',
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Rua Refresh, 100',
      city: 'Rio de Janeiro',
      state: 'RJ',
    })

    const sessionResponse = await request(app.server).post('/sessions').send({
      email: 'org@mail.com',
      password: '123456',
    })

    expect(sessionResponse.statusCode).toBe(200)

    const refreshTokenCookie = sessionResponse.headers['set-cookie']?.find(
      (cookie: string) => cookie.includes('refreshToken'),
    )

    expect(refreshTokenCookie).toBeDefined()

    const refreshToken = refreshTokenCookie.split(';')[0].split('=')[1]

    const refreshResponse = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`)

    expect(refreshResponse.statusCode).toBe(200)
    expect(refreshResponse.body).toEqual({
      token: expect.any(String),
    })
  })
})
