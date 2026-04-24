import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import '@/tests/@utils/test-setup.js'
import { createOrgAndSession } from '@/tests/@utils/org.js'

describe('Pet Create (E2E)', () => {
  it('should be able to create a pet', async () => {
    const { token } = await createOrgAndSession({
      name: 'Pet Org',
      email: 'petorg@mail.com',
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Av. Pet, 500',
      city: 'São Paulo',
      state: 'SP',
    })

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