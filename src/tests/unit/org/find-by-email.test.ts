import { beforeEach, describe, expect, it } from 'vitest'
import { OrgInMemoryRepository } from '@/repositories/in-memory/org-in-memory.repository'
import { ResourceNotFoundError } from '@/use-case/@errors/resource-not-found.error'
import { FindByEmailUseCase } from '@/use-case/org/find-by-email.use-case'

let inMemoryRepository: OrgInMemoryRepository
let sut: FindByEmailUseCase

const testOrg = {
  name: 'John Doe Org',
  email: 'org@mail.com',
  whatsapp: '(19) 99999-9999',
  password_hash: '123456',
  address: 'Rua Tal, 39',
  city: 'Campinas',
  state: 'SP',
}

describe('Org find by email tests', () => {
  beforeEach(() => {
    inMemoryRepository = new OrgInMemoryRepository()
    sut = new FindByEmailUseCase(inMemoryRepository)
  })

  it('should find org by email', async () => {
    const newOrg = await inMemoryRepository.create(testOrg)

    const { org } = await sut.execute({ email: newOrg.email })

    expect(org.id).toEqual(expect.any(String))
    expect(org.email).toEqual(testOrg.email)
  })

  it('should fail if org is not found', async () => {
    await expect(sut.execute({ email: 'non@existent.com' })).rejects.instanceOf(
      ResourceNotFoundError,
    )
  })
})
