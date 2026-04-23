import type { OrgRepository } from '@/repositories/org.repository'
import type { Org } from '../../../generated/prisma/client'
import { ResourceNotFoundError } from '../@errors/resource-not-found.error'

interface FindByEmailRequest {
  email: string
}

interface FindByEmailResponse {
  org: Org
}

export class FindByEmailUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({ email }: FindByEmailRequest): Promise<FindByEmailResponse> {
    const org = await this.orgRepository.findByEmail(email)

    if (!org) throw new ResourceNotFoundError()

    return { org }
  }
}
