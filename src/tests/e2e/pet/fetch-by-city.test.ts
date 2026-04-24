import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Pet Fetch By City (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch pets by city', async () => {
    const orgResponse = await request(app.server).post('/orgs').send({
      name: 'City Pet Org',
      email: 'citypet@mail.com',
      whatsapp: '(51) 93333-2222',
      password: '123456',
      address: 'Rua City, 10',
      city: 'Porto Alegre',
      state: 'RS',
    })
    expect(orgResponse.statusCode).toBe(201)

    const sessionResponse = await request(app.server).post('/sessions').send({
      email: 'citypet@mail.com',
      password: '123456',
    })
    expect(sessionResponse.statusCode).toBe(200)

    const token = sessionResponse.body.token

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