import type { Pet, Prisma } from '../../generated/prisma/client'

export interface PetFilters {
  species?: string
  race?: string
  color?: string
  size?: string
  age?: string
}

export interface PetRepository {
  create(data: Prisma.PetCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  fetchByCity(city: string, filters?: PetFilters): Promise<Pet[]>
}