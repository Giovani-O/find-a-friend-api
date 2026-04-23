import { prisma } from '@/lib/prisma'
import type { Prisma } from '../../../generated/prisma/client'

export class PrismaOrgRepository {
  async create(data: Prisma.OrgCreateInput) {
    const org = await prisma.org.create({ data })

    return org
  }

  async findById(id: string) {
    const org = await prisma.org.findUnique({
      where: {
        id,
      },
    })

    return org
  }

  async findByEmail(email: string) {
    const org = await prisma.org.findUnique({
      where: {
        email,
      },
    })

    return org
  }

  async fetchByCity(city: string) {
    const orgs = await prisma.org.findMany({
      where: {
        city,
      },
    })

    return orgs
  }
}
