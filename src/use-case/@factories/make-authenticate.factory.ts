import { PrismaOrgRepository } from '@/repositories/prisma/org-prisma.repository'
import { AuthenticateUseCase } from '../org/authenticate.use-case'

export function makeAuthenticateUseCase() {
  const orgRepository = new PrismaOrgRepository()
  const authenticateUseCase = new AuthenticateUseCase(orgRepository)

  return authenticateUseCase
}
