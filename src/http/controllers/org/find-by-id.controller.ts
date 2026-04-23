import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeFindByIdUseCase } from '@/use-case/@factories/make-find-by-id.factory'

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  const findByIdUseCase = makeFindByIdUseCase()

  const org = await findByIdUseCase.execute({ id: request.user.sub })

  return reply.status(200).send({ org })
}
