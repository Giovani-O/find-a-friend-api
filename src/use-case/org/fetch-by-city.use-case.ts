import type { OrgRepository } from '@/repositories/org.repository'
import type { Org } from '../../../generated/prisma/client'

interface FetchByCityRequest {
  city: string
}

interface FetchByCityResponse {
  orgs: Org[]
}

export class FetchByCityUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({ city }: FetchByCityRequest): Promise<FetchByCityResponse> {
    const orgs = await this.orgRepository.fetchByCity(city)

    return { orgs }
  }
}
