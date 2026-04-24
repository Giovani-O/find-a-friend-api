import type { PetRepository } from '@/repositories/pet.repository'
import type { Pet } from '../../../generated/prisma/client'
import { ResourceNotFoundError } from '../@errors/resource-not-found.error'

interface FindPetByIdRequest {
  id: string
}

interface FindPetByIdResponse {
  pet: Pet
}

export class FindPetByIdUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({ id }: FindPetByIdRequest): Promise<FindPetByIdResponse> {
    const pet = await this.petRepository.findById(id)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    return { pet }
  }
}
