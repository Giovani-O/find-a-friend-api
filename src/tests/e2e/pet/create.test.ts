import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Pet Create (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const orgResponse = await request(app.server).post('/orgs').send({
      name: 'Pet Org',
      email: 'petorg@mail.com',
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Av. Pet, 500',
      city: 'São Paulo',
      state: 'SP',
    })
    expect(orgResponse.statusCode).toBe(201)

    const sessionResponse = await request(app.server).post('/sessions').send({
      email: 'petorg@mail.com',
      password: '123456',
    })
    expect(sessionResponse.statusCode).toBe(200)

    const token = sessionResponse.body.token

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pet Dog',
        species: 'DOG',
        race: 'Labrador',
        color: 'Golden',
        size: 'LARGE',
        age: '3',
        description: 'A friendly dog',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.pet.name).toBe('Pet Dog')
  })
})