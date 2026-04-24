import { prisma } from '@/lib/prisma'
import type { Prisma, Size, Species } from '../../../generated/prisma/client'
import type { PetFilters, PetRepository } from '../pet.repository'

export class PrismaPetRepository implements PetRepository {
  async create(data: Prisma.PetCreateInput) {
    const pet = await prisma.pet.create({ data })

    return pet
  }

  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
      include: {
        org: true,
      },
    })

    return pet
  }

  async fetchByCity(city: string, filters?: PetFilters) {
    const where: Prisma.PetWhereInput = {
      org: {
        city,
      },
    }

    if (filters?.species) {
      where.species = filters.species as Species
    }
    if (filters?.race) {
      where.race = filters.race
    }
    if (filters?.color) {
      where.color = filters.color
    }
    if (filters?.size) {
      where.size = filters.size as Size
    }
    if (filters?.age) {
      where.age = filters.age
    }

    const pets = await prisma.pet.findMany({
      where,
      include: {
        org: true,
      },
    })

    return pets
  }
}
