import { randomUUID } from 'node:crypto'
import type { Org } from '../../../generated/prisma/client'
import type { OrgCreateInput } from '../../../generated/prisma/models'
import type { OrgRepository } from '../org.repository'

export class OrgInMemoryRepository implements OrgRepository {
  public items: Org[] = []

  async create(data: OrgCreateInput): Promise<Org> {
    const org = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      password_hash: data.password_hash,
      address: data.address,
      city: data.city,
      state: data.state,
      created_at: new Date(),
    } as Org

    this.items.push(org)

    return org
  }

  async findById(id: string): Promise<Org | null> {
    const org = this.items.find((item) => item.id === id)

    if (!org) return null

    return org
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = this.items.find((item) => item.email === email)

    if (!org) return null

    return org
  }

  async fetchByCity(city: string): Promise<Org[]> {
    const orgs = this.items.filter((item) => item.city === city)

    return orgs
  }
}
