import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-case/@errors/resource-not-found.error'
import { makeFindPetByIdUseCase } from '@/use-case/@factories/make-pet-find-by-id.factory.js'

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  const findByIdSchema = z.object({
    id: z.uuid(),
  })

  const { id } = findByIdSchema.parse(request.params)

  const findPetByIdUseCase = makeFindPetByIdUseCase()

  try {
    const { pet } = await findPetByIdUseCase.execute({ id })

    return reply.status(200).send({ pet })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: '[404] Not Found',
      })
    }

    throw err
  }
}
