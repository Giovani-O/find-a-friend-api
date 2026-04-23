import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma.repository'
import { FetchByCityUseCase } from '../org/fetch-by-city.use-case'

export function makeFetchByCityUseCase() {
  const repository = new PrismaOrgRepository()
  const useCase = new FetchByCityUseCase(repository)

  return useCase
}
