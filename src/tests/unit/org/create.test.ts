import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrgInMemoryRepository } from '@/repositories/in-memory/org-in-memory.repository'
import { OrgAlreadyExistsError } from '@/use-case/@errors/org-already-exists.error'
import { CreateOrgUseCase } from '@/use-case/org/create.use-case'

let inMemoryRepository: OrgInMemoryRepository
let sut: CreateOrgUseCase

const testOrg = {
  name: 'John Doe Org',
  email: 'org@mail.com',
  whatsapp: '(19) 99999-9999',
  password: '123456',
  address: 'Rua Tal, 39',
  city: 'Campinas',
  state: 'SP',
}

describe('Org creation unit tests', () => {
  beforeEach(() => {
    inMemoryRepository = new OrgInMemoryRepository()
    sut = new CreateOrgUseCase(inMemoryRepository)
  })

  it('should be able to create org', async () => {
    const email = 'org@mail.com'
    const { org } = await sut.execute({
      ...testOrg,
      email,
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org.email).toBe(email)
  })

  it('should encrypt password on creation', async () => {
    const { org } = await sut.execute(testOrg)

    const isPasswordHashed = await compare('123456', org.password_hash)
    expect(isPasswordHashed).toBe(true)
  })

  it('should fail if email is already in use', async () => {
    await sut.execute(testOrg)

    await expect(sut.execute(testOrg)).rejects.instanceOf(OrgAlreadyExistsError)
  })
})
