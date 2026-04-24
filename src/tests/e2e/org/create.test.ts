import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import '@/tests/@utils/test-setup.js'

describe('Create Org (E2E)', () => {
  it('should be able to create a new org', async () => {
    const response = await request(app.server).post('/orgs').send({
      name: 'New Org',
      email: 'org@mail.com',
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Test Street, 123',
      city: 'São Paulo',
      state: 'SP',
    })

    expect(response.statusCode).toBe(201)
  })
})
