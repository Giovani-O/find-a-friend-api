import { hash } from 'bcryptjs'
import type { OrgRepository } from '@/repositories/org.repository'
import type { Org } from '../../../generated/prisma/client'
import { OrgAlreadyExistsError } from '../@errors/org-already-exists.error'
import { UnknownError } from '../@errors/unknown-error.error'

interface CreateOrgRequest {
  name: string
  email: string
  whatsapp: string
  password: string
  address: string
  city: string
  state: string
}

interface CreateOrgResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({
    name,
    email,
    whatsapp,
    password,
    address,
    city,
    state,
  }: CreateOrgRequest): Promise<CreateOrgResponse> {
    try {
      const password_hash = await hash(password, 6)

      const orgWithSameEmail = await this.orgRepository.findByEmail(email)
      if (orgWithSameEmail != null) throw new OrgAlreadyExistsError()

      const org = await this.orgRepository.create({
        name,
        email,
        whatsapp,
        password_hash,
        address,
        city,
        state,
      })

      return { org }
    } catch {
      throw new UnknownError()
    }
  }
}
