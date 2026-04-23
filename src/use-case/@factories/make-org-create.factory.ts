import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma.repository'
import { CreateOrgUseCase } from '../org/create.use-case'

export function makeOrgCreateUseCase() {
  const repository = new PrismaOrgRepository()
  const useCase = new CreateOrgUseCase(repository)

  return useCase
}
