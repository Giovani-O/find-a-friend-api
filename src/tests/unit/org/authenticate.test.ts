import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrgInMemoryRepository } from '@/repositories/in-memory/org-in-memory.repository'
import { InvalidCredentialsError } from '@/use-case/@errors/invalid-credentials.error'
import { AuthenticateUseCase } from '@/use-case/org/authenticate.use-case'

let inMemoryRepository: OrgInMemoryRepository
let sut: AuthenticateUseCase

const testOrg = {
  name: 'John Doe Org',
  email: 'org@mail.com',
  whatsapp: '(19) 99999-9999',
  password_hash: '',
  address: 'Rua Tal, 39',
  city: 'Campinas',
  state: 'SP',
}

describe('Org authentication tests', () => {
  beforeEach(() => {
    inMemoryRepository = new OrgInMemoryRepository()
    sut = new AuthenticateUseCase(inMemoryRepository)
  })

  it('should authenticate', async () => {
    await inMemoryRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    const { org } = await sut.execute({
      email: 'org@mail.com',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org.email).toEqual(testOrg.email)
  })

  it('should fail email is invalid', async () => {
    await inMemoryRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    await expect(
      sut.execute({ email: 'wrong@email.com', password: '123456' }),
    ).rejects.instanceOf(InvalidCredentialsError)
  })

  it('should fail password is invalid', async () => {
    await inMemoryRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    await expect(
      sut.execute({ email: 'org@email.com', password: 'wrong password' }),
    ).rejects.instanceOf(InvalidCredentialsError)
  })
})
