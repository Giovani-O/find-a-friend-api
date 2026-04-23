import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { OrgAlreadyExistsError } from '@/use-case/@errors/org-already-exists.error'
import { makeOrgCreateUseCase } from '@/use-case/@factories/make-org-create.factory'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    whatsapp: z.string(),
    password: z.string().min(6),
    address: z.string(),
    city: z.string(),
    state: z.string(),
  })

  const body = createBodySchema.parse(request.body)

  try {
    const createOrgUseCase = makeOrgCreateUseCase()

    await createOrgUseCase.execute(body)
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      reply.status(409).send({
        message: '[409] Conflict',
      })
    }

    throw err
  }

  return reply.status(201).send()
}
