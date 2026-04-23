import type { OrgRepository } from '@/repositories/org.repository'
import type { Org } from '../../../generated/prisma/client'
import { ResourceNotFoundError } from '../@errors/resource-not-found.error'

interface FindByIdRequest {
  id: string
}

interface FindByIdResponse {
  org: Org
}

export class FindByIdUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({ id }: FindByIdRequest): Promise<FindByIdResponse> {
    const org = await this.orgRepository.findById(id)

    if (!org) throw new ResourceNotFoundError()

    return { org }
  }
}
