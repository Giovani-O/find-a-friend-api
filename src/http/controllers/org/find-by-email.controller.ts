import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-case/@errors/resource-not-found.error'
import { makeFindByEmailUseCase } from '@/use-case/@factories/make-find-by-email.factory'

export async function findByEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findByEmailScheme = z.object({
    email: z.email(),
  })

  const body = findByEmailScheme.parse(request.body)

  try {
    const findByEmailUseCase = makeFindByEmailUseCase()
    const { org } = await findByEmailUseCase.execute(body)

    return reply.status(200).send({ org })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404).send({
        message: '[404] Not Found',
      })
    }

    throw err
  }
}
