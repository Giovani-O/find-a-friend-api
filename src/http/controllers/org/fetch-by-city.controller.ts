import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFetchByCityUseCase } from '@/use-case/@factories/make-fetch-by-city.factory'

export async function fetchByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchByCityScheme = z.object({
    city: z.string(),
  })

  const body = fetchByCityScheme.parse(request.body)

  const fetchByCityUseCase = makeFetchByCityUseCase()
  const { orgs } = await fetchByCityUseCase.execute(body)

  return reply.status(200).send({ orgs })
}
