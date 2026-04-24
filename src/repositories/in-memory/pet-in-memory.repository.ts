import { randomUUID } from 'node:crypto'
import type { Org, Pet } from '../../../generated/prisma/client'
import type { PetCreateInput } from '../../../generated/prisma/models'
import type { PetFilters, PetRepository } from '../pet.repository'

export class InMemoryPetRepository implements PetRepository {
  public pets: Pet[] = []
  public orgs: Org[] = []

  async create(data: PetCreateInput): Promise<Pet> {
    const orgId = data.org.connect?.id

    const pet = {
      id: randomUUID(),
      name: data.name,
      species: data.species,
      race: data.race,
      color: data.color,
      size: data.size,
      age: data.age,
      description: data.description,
      org_id: orgId ?? '',
      created_at: new Date(),
      updated_at: new Date(),
    } as Pet

    this.pets.push(pet)

    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = this.pets.find((pet) => pet.id === id)

    if (!pet) return null

    const org = this.orgs.find((o) => o.id === pet.org_id)

    return { ...pet, org } as Pet
  }

  async fetchByCity(city: string, filters?: PetFilters): Promise<Pet[]> {
    const orgsInCity = this.orgs.filter((o) => o.city === city)
    const orgIds = new Set(orgsInCity.map((o) => o.id))

    let pets = this.pets
      .filter((pet) => orgIds.has(pet.org_id))
      .map((pet) => {
        const org = this.orgs.find((o) => o.id === pet.org_id)
        return { ...pet, org } as Pet
      })

    if (filters?.species) {
      pets = pets.filter((pet) => pet.species === filters.species)
    }
    if (filters?.race) {
      pets = pets.filter((pet) => pet.race === filters.race)
    }
    if (filters?.color) {
      pets = pets.filter((pet) => pet.color === filters.color)
    }
    if (filters?.size) {
      pets = pets.filter((pet) => pet.size === filters.size)
    }
    if (filters?.age) {
      pets = pets.filter((pet) => pet.age === filters.age)
    }

    return pets
  }
}
