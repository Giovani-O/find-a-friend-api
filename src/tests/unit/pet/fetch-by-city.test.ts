import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrgInMemoryRepository } from '@/repositories/in-memory/org-in-memory.repository'
import { InMemoryPetRepository } from '@/repositories/in-memory/pet-in-memory.repository'
import { FetchPetsByCityUseCase } from '@/use-case/pet/fetch-by-city.use-case'
import { Size, Species } from '../../../../generated/prisma/client'

let inMemoryPetRepository: InMemoryPetRepository
let inMemoryOrgRepository: OrgInMemoryRepository
let sut: FetchPetsByCityUseCase

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

describe('Pet fetch by city unit tests', () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository()
    inMemoryOrgRepository = new OrgInMemoryRepository()
    inMemoryPetRepository.orgs = inMemoryOrgRepository.items
    sut = new FetchPetsByCityUseCase(inMemoryPetRepository)
  })

  it('should find pets by city', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    await inMemoryPetRepository.create({
      ...testPet,
      org: { connect: { id: org.id } },
    })
    await inMemoryPetRepository.create({
      name: 'Max',
      species: Species.CAT,
      race: 'Persian',
      color: 'White',
      size: Size.SMALL,
      age: '2',
      description: 'Calm cat',
      org: { connect: { id: org.id } },
    })

    const { pets } = await sut.execute({ city: 'Campinas' })

    expect(pets).toHaveLength(2)
  })

  it('should return empty array if no pets found in city', async () => {
    const { pets } = await sut.execute({ city: 'Hortolândia' })

    expect(pets).toEqual([])
  })

  it('should filter pets by species', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    await inMemoryPetRepository.create({
      ...testPet,
      org: { connect: { id: org.id } },
    })
    await inMemoryPetRepository.create({
      name: 'Max',
      species: Species.CAT,
      race: 'Persian',
      color: 'White',
      size: Size.SMALL,
      age: '2',
      description: 'Calm cat',
      org: { connect: { id: org.id } },
    })

    const { pets } = await sut.execute({
      city: 'Campinas',
      filters: { species: Species.DOG },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].species).toBe(Species.DOG)
  })

  it('should filter pets by size', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    await inMemoryPetRepository.create({
      ...testPet,
      org: { connect: { id: org.id } },
    })
    await inMemoryPetRepository.create({
      name: 'Max',
      species: Species.CAT,
      race: 'Persian',
      color: 'White',
      size: Size.SMALL,
      age: '2',
      description: 'Calm cat',
      org: { connect: { id: org.id } },
    })

    const { pets } = await sut.execute({
      city: 'Campinas',
      filters: { size: Size.LARGE },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].size).toBe(Size.LARGE)
  })

  it('should filter pets by multiple filters', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    await inMemoryPetRepository.create({
      ...testPet,
      org: { connect: { id: org.id } },
    })
    await inMemoryPetRepository.create({
      name: 'Max',
      species: Species.DOG,
      race: 'Golden Retriever',
      color: 'Golden',
      size: Size.SMALL,
      age: '2',
      description: 'Puppy',
      org: { connect: { id: org.id } },
    })

    const { pets } = await sut.execute({
      city: 'Campinas',
      filters: { species: Species.DOG, size: Size.LARGE },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].size).toBe(Size.LARGE)
  })

  it('should return pet with org_id', async () => {
    const org = await inMemoryOrgRepository.create({
      ...testOrg,
      password_hash: await hash('123456', 6),
    })

    await inMemoryPetRepository.create({
      ...testPet,
      org: { connect: { id: org.id } },
    })

    const { pets } = await sut.execute({ city: 'Campinas' })

    expect(pets[0].org_id).toBeDefined()
    expect(pets[0].org_id).toBe(org.id)
  })
})
