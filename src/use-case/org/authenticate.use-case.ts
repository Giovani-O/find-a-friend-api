import { compare } from 'bcryptjs'
import type { OrgRepository } from '@/repositories/org.repository'
import type { Org } from '../../../generated/prisma/client'
import { InvalidCredentialsError } from '../@errors/invalid-credentials.error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  org: Org
}

export class AuthenticateUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const org = await this.orgRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordsMatch = await compare(password, org.password_hash)

    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    return {
      org,
    }
  }
}
