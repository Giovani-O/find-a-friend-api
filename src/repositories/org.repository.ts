import type { Org, Prisma } from '../../generated/prisma/client'

export interface OrgRepository {
  create(data: Prisma.OrgCreateInput): Promise<Org>
  findById(id: string): Promise<Org | null>
  findByEmail(email: string): Promise<Org | null>
  fetchByCity(city: string): Promise<Org[]>
}
