import type { OrgRepository } from '@/repositories/org.repository'
import type { PetRepository } from '@/repositories/pet.repository'
import type { Pet, Size, Species } from '../../../generated/prisma/client'
import { ResourceNotFoundError } from '../@errors/resource-not-found.error'

interface CreatePetRequest {
  name: string
  species: Species
  race: string
  color: string
  size: Size
  age: string
  description: string
  orgId: string
}

interface CreatePetResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petRepository: PetRepository,
    private orgRepository: OrgRepository,
  ) {}

  async execute({
    name,
    species,
    race,
    color,
    size,
    age,
    description,
    orgId,
  }: CreatePetRequest): Promise<CreatePetResponse> {
    const org = await this.orgRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petRepository.create({
      name,
      species,
      race,
      color,
      size,
      age,
      description,
      org: {
        connect: {
          id: orgId,
        },
      },
    })

    return { pet }
  }
}
