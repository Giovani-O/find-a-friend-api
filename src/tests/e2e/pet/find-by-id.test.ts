import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Pet Find By ID (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to find pet by id', async () => {
    const orgResponse = await request(app.server).post('/orgs').send({
      name: 'Find Pet Org',
      email: 'findpet@mail.com',
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Av. FindPet, 500',
      city: 'Rio de Janeiro',
      state: 'RJ',
    })
    expect(orgResponse.statusCode).toBe(201)

    const sessionResponse = await request(app.server).post('/sessions').send({
      email: 'findpet@mail.com',
      password: '123456',
    })
    expect(sessionResponse.statusCode).toBe(200)

    const token = sessionResponse.body.token

    const petResponse = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        species: 'DOG',
        race: 'Golden Retriever',
        color: 'Golden',
        size: 'LARGE',
        age: '5',
        description: 'A lovely dog',
      })
    expect(petResponse.statusCode).toBe(201)

    const petId = petResponse.body.pet.id

    const response = await request(app.server).get(`/pets/${petId}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.pet.name).toBe('Buddy')
  })
})