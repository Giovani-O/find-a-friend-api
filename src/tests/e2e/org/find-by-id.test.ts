import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import '@/tests/@utils/test-setup.js'
import { createOrgAndSession } from '@/tests/@utils/org.js'

describe('Find By ID (E2E)', () => {
  it('should be able to find org by id', async () => {
    const { token } = await createOrgAndSession({
      name: 'Find By ID Org',
      email: 'org@mail.com',
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Av. FindById, 500',
      city: 'Belo Horizonte',
      state: 'MG',
    })

    const response = await request(app.server)
      .get('/orgs/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.org.email).toBe('org@mail.com')
  })
})
