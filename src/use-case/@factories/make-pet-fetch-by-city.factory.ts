import { PrismaPetRepository } from '@/repositories/prisma/pet-prisma.repository'
import { FetchPetsByCityUseCase } from '../pet/fetch-by-city.use-case'

export function makeFetchPetsByCityUseCase() {
  const repository = new PrismaPetRepository()
  const useCase = new FetchPetsByCityUseCase(repository)

  return useCase
}