import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrgInMemoryRepository } from '@/repositories/in-memory/org-in-memory.repository'
import { ResourceNotFoundError } from '@/use-case/@errors/resource-not-found.error'
import { FindByIdUseCase } from '@/use-case/org/find-by-id.use-case'

let inMemoryRepository: OrgInMemoryRepository
let sut: FindByIdUseCase

const testOrg = {
  name: 'John Doe Org',
  email: 'org@mail.com',
  whatsapp: '(19) 99999-9999',
  password_hash: '',
  address: 'Rua Tal, 39',
  city: 'Campinas',
  state: 'SP',
}

describe('Org find by id tests', () => {
  beforeEach(() => {
    inMemoryRepository = new OrgInMemoryRepository()
    sut = new FindByIdUseCase(inMemoryRepository)
  })

  it('should find org by id', async () => {
    const newOrg = await inMemoryRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    const { org } = await sut.execute({ id: newOrg.id })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should fail if org is not found', async () => {
    await expect(sut.execute({ id: 'non-existent-org' })).rejects.instanceOf(
      ResourceNotFoundError,
    )
  })
})
