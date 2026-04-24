import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrgInMemoryRepository } from '@/repositories/in-memory/org-in-memory.repository'
import { InMemoryPetRepository } from '@/repositories/in-memory/pet-in-memory.repository'
import { ResourceNotFoundError } from '@/use-case/@errors/resource-not-found.error'
import { FindPetByIdUseCase } from '@/use-case/pet/find-by-id.use-case'
import { Size, Species } from '../../../../generated/prisma/client'

let inMemoryPetRepository: InMemoryPetRepository
let inMemoryOrgRepository: OrgInMemoryRepository
let sut: FindPetByIdUseCase

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

describe('Pet find by id unit tests', () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository()
    inMemoryOrgRepository = new OrgInMemoryRepository()
    inMemoryPetRepository.orgs = inMemoryOrgRepository.items
    sut = new FindPetByIdUseCase(inMemoryPetRepository)
  })

  it('should find pet by id', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    const pet = await inMemoryPetRepository.create({
      ...testPet,
      org: {
        connect: {
          id: org.id,
        },
      },
    })

    const { pet: foundPet } = await sut.execute({ id: pet.id })

    expect(foundPet.id).toBe(pet.id)
    expect(foundPet.name).toBe(testPet.name)
  })

  it('should fail if pet is not found', async () => {
    await expect(sut.execute({ id: 'non-existent-pet' })).rejects.instanceOf(
      ResourceNotFoundError,
    )
  })

  it('should return pet with org_id', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    const pet = await inMemoryPetRepository.create({
      ...testPet,
      org: {
        connect: {
          id: org.id,
        },
      },
    })

    const { pet: foundPet } = await sut.execute({ id: pet.id })

    expect(foundPet.org_id).toBeDefined()
    expect(foundPet.org_id).toBe(org.id)
  })
})
