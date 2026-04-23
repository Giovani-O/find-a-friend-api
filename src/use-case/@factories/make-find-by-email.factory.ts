import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma.repository'
import { FindByEmailUseCase } from '../org/find-by-email.use-case'

export function makeFindByEmailUseCase() {
  const repository = new PrismaOrgRepository()
  const useCase = new FindByEmailUseCase(repository)

  return useCase
}
