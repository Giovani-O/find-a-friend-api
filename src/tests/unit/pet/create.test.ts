import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrgInMemoryRepository } from '@/repositories/in-memory/org-in-memory.repository'
import { InMemoryPetRepository } from '@/repositories/in-memory/pet-in-memory.repository'
import { ResourceNotFoundError } from '@/use-case/@errors/resource-not-found.error'
import { CreatePetUseCase } from '@/use-case/pet/create.use-case'
import { Size, Species } from '../../../../generated/prisma/enums'

let inMemoryPetRepository: InMemoryPetRepository
let inMemoryOrgRepository: OrgInMemoryRepository
let sut: CreatePetUseCase

const testOrg = {
  name: 'John Doe Org',
  email: 'org@mail.com',
  whatsapp: '(19) 99999-9999',
  password_hash: '',
  address: 'Rua Tal, 39',
  city: 'Campinas',
  state: 'SP',
}

const testPet = {
  name: 'Buddy',
  species: Species.DOG,
  race: 'Golden Retriever',
  color: 'Golden',
  size: Size.LARGE,
  age: '3',
  description: 'Friendly dog',
}

describe('Pet creation unit tests', () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository()
    inMemoryOrgRepository = new OrgInMemoryRepository()
    inMemoryPetRepository.orgs = inMemoryOrgRepository.items
    sut = new CreatePetUseCase(inMemoryPetRepository, inMemoryOrgRepository)
  })

  it('should be able to create a pet', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    const { pet } = await sut.execute({
      ...testPet,
      orgId: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.name).toBe(testPet.name)
    expect(pet.species).toBe(testPet.species)
  })

  it('should fail if org does not exist', async () => {
    await expect(
      sut.execute({
        ...testPet,
        orgId: 'non-existent-org',
      }),
    ).rejects.instanceOf(ResourceNotFoundError)
  })

  it('should create pet with org_id', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    const { pet } = await sut.execute({
      ...testPet,
      orgId: org.id,
    })

    expect(pet.org_id).toBe(org.id)
  })

  it('should create pet with all attributes', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    const { pet } = await sut.execute({
      ...testPet,
      orgId: org.id,
    })

    expect(pet.race).toBe(testPet.race)
    expect(pet.color).toBe(testPet.color)
    expect(pet.size).toBe(testPet.size)
    expect(pet.age).toBe(testPet.age)
    expect(pet.description).toBe(testPet.description)
  })
})
