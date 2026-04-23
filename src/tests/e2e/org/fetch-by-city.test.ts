import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Fetch By City (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch orgs by city', async () => {
    await request(app.server).post('/orgs').send({
      name: 'City Org 1',
      email: 'cityorg1@mail.com',
      whatsapp: '(51) 93333-2222',
      password: '123456',
      address: 'Rua City, 10',
      city: 'Porto Alegre',
      state: 'RS',
    })

    await request(app.server).post('/orgs').send({
      name: 'City Org 2',
      email: 'cityorg2@mail.com',
      whatsapp: '(51) 92222-1111',
      password: '123456',
      address: 'Rua City, 20',
      city: 'Porto Alegre',
      state: 'RS',
    })

    const response = await request(app.server).post('/orgs/fetch-by-city').send({
      city: 'Porto Alegre',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.orgs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'City Org 1',
          email: 'cityorg1@mail.com',
          city: 'Porto Alegre',
          state: 'RS',
        }),
        expect.objectContaining({
          name: 'City Org 2',
          email: 'cityorg2@mail.com',
          city: 'Porto Alegre',
          state: 'RS',
        }),
      ]),
    )
  })
})
