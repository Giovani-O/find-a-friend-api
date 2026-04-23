import { beforeEach, describe, expect, it } from 'vitest'
import { OrgInMemoryRepository } from '@/repositories/in-memory/org-in-memory.repository'
import { FetchByCityUseCase } from '@/use-case/org/fetch-by-city.use-case'

let inMemoryRepository: OrgInMemoryRepository
let sut: FetchByCityUseCase

const testOrg = {
  name: 'John Doe Org',
  email: 'org@mail.com',
  whatsapp: '(19) 99999-9999',
  password_hash: '123456',
  address: 'Rua Tal, 39',
  city: 'Campinas',
  state: 'SP',
}

describe('Org fetch by city tests', () => {
  beforeEach(() => {
    inMemoryRepository = new OrgInMemoryRepository()
    sut = new FetchByCityUseCase(inMemoryRepository)
  })

  it('should find orgs by city', async () => {
    const newOrg1 = await inMemoryRepository.create({ ...testOrg })
    const newOrg2 = await inMemoryRepository.create({
      ...testOrg,
      email: 'org2@mail.com',
      whatsapp: '(19) 98888-8888',
    })
    // Org in different city
    await inMemoryRepository.create({
      ...testOrg,
      city: 'Sumaré',
      email: 'org3@mail.com',
      whatsapp: '(19) 98888-8888',
    })

    const { orgs } = await sut.execute({ city: 'Campinas' })

    expect(orgs).toHaveLength(2)
    expect(orgs).toEqual([
      expect.objectContaining({ city: newOrg1.city }),
      expect.objectContaining({ city: newOrg2.city }),
    ])
  })

  it('should return empty array if no orgs found in a city', async () => {
    const { orgs } = await sut.execute({ city: 'Hortolândia' })

    expect(orgs).toEqual([])
  })
})
