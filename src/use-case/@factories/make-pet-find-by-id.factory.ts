import { PrismaPetRepository } from '@/repositories/prisma/pet-prisma.repository'
import { FindPetByIdUseCase } from '../pet/find-by-id.use-case'

export function makeFindPetByIdUseCase() {
  const repository = new PrismaPetRepository()
  const useCase = new FindPetByIdUseCase(repository)

  return useCase
}