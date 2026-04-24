import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import '@/tests/@utils/test-setup.js'
import { createOrgAndSession } from '@/tests/@utils/org.js'

describe('Pet Fetch By City (E2E)', () => {
  it('should be able to fetch pets by city', async () => {
    const { token } = await createOrgAndSession({
      name: 'City Pet Org',
      email: 'citypet@mail.com',
      whatsapp: '(51) 93333-2222',
      password: '123456',
      address: 'Rua City, 10',
      city: 'Porto Alegre',
      state: 'RS',
    })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pet One',
        species: 'DOG',
        race: 'Beagle',
        color: 'Brown',
        size: 'MEDIUM',
        age: '2',
        description: 'A cute dog',
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pet Two',
        species: 'CAT',
        race: 'Persian',
        color: 'White',
        size: 'SMALL',
        age: '1',
        description: 'A fluffy cat',
      })

    const response = await request(app.server).post('/pets/fetch-by-city').send({
      city: 'Porto Alegre',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Pet One',
          species: 'DOG',
        }),
        expect.objectContaining({
          name: 'Pet Two',
          species: 'CAT',
        }),
      ]),
    )
  })
})