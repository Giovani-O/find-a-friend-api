import type { PetFilters, PetRepository } from '@/repositories/pet.repository'
import type { Pet } from '../../../generated/prisma/client'

interface FetchPetsByCityRequest {
  city: string
  filters?: PetFilters
}

interface FetchPetsByCityResponse {
  pets: Pet[]
}

export class FetchPetsByCityUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    city,
    filters,
  }: FetchPetsByCityRequest): Promise<FetchPetsByCityResponse> {
    const pets = await this.petRepository.fetchByCity(city, filters)

    return { pets }
  }
}
