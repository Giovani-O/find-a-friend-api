import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeCreatePetUseCase } from '@/use-case/@factories/make-pet-create.factory.js'
import { Size, Species } from '../../../../generated/prisma/enums'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    species: z.enum(Species),
    race: z.string(),
    color: z.string(),
    size: z.enum(Size),
    age: z.string(),
    description: z.string(),
  })

  const body = createBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  const { pet } = await createPetUseCase.execute({
    ...body,
    orgId: request.user.sub,
  })

  return reply.status(201).send({ pet })
}
