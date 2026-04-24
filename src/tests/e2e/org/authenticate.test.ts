import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import '@/tests/@utils/test-setup.js'
import { createOrg } from '@/tests/@utils/org.js'

describe('Authenticate (E2E)', () => {
  it('should be able to authenticate', async () => {
    await createOrg({
      name: 'John Doe Org',
      email: 'org@mail.com',
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Rua Tal, 39',
      city: 'Campinas',
      state: 'SP',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'org@mail.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
