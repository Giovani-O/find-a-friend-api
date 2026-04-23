import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma.repository'
import { FindByIdUseCase } from '../org/find-by-id.use-case'

export function makeFindByIdUseCase() {
  const repository = new PrismaOrgRepository()
  const useCase = new FindByIdUseCase(repository)

  return useCase
}
