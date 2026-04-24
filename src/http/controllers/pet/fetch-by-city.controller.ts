import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFetchPetsByCityUseCase } from '@/use-case/@factories/make-pet-fetch-by-city.factory.js'
import { Size, Species } from '../../../../generated/prisma/enums'

export async function fetchByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchByCitySchema = z.object({
    city: z.string(),
    species: z.enum(Species).optional(),
    race: z.string().optional(),
    color: z.string().optional(),
    size: z.enum(Size).optional(),
    age: z.string().optional(),
  })

  const body = fetchByCitySchema.parse(request.body)
  const { city, ...filters } = body

  const fetchPetsByCityUseCase = makeFetchPetsByCityUseCase()
  const { pets } = await fetchPetsByCityUseCase.execute({ city, filters })

  return reply.status(200).send({ pets })
}
