import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma.repository'
import { PrismaPetRepository } from '@/repositories/prisma/pet-prisma.repository'
import { CreatePetUseCase } from '../pet/create.use-case'

export function makeCreatePetUseCase() {
  const petRepository = new PrismaPetRepository()
  const orgRepository = new PrismaOrgRepository()
  const useCase = new CreatePetUseCase(petRepository, orgRepository)

  return useCase
}
