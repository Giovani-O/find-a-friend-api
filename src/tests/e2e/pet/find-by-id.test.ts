import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import '@/tests/@utils/test-setup.js'
import { createOrgAndSession } from '@/tests/@utils/org.js'

describe('Pet Find By ID (E2E)', () => {
  it('should be able to find pet by id', async () => {
    const { token } = await createOrgAndSession({
      name: 'Find Pet Org',
      email: 'findpet@mail.com',
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Av. FindPet, 500',
      city: 'Rio de Janeiro',
      state: 'RJ',
    })

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