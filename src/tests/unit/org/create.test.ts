import { beforeEach, describe, expect, it } from 'vitest'
import { OrgInMemoryRepository } from '@/repositories/in-memory/org-in-memory.repository'
import { CreateOrgUseCase } from '@/use-case/org/create.use-case'

let inMemoryRepository: OrgInMemoryRepository
let sut: CreateOrgUseCase

describe('Org unit tests', () => {
  beforeEach(() => {
    inMemoryRepository = new OrgInMemoryRepository()
    sut = new CreateOrgUseCase(inMemoryRepository)
  })

  it('should be able to create org', async () => {
    const email = 'org@mail.com'
    const { org } = await sut.execute({
      name: 'John Doe Org',
      email,
      whatsapp: '(19) 99999-9999',
      password: '123456',
      address: 'Rua Tal, 39',
      city: 'Campinas',
      state: 'SP',
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org.email).toBe(email)
  })
})
