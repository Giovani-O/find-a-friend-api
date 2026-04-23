import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { InvalidCredentialsError } from '@/use-case/@errors/invalid-credentials.error'
import { makeAuthenticateUseCase } from '@/use-case/@factories/make-authenticate.factory'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodyScheme = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  const body = authenticateBodyScheme.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { org } = await authenticateUseCase.execute(body)

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
          expiresIn: '7d',
        },
      },
    )

    // Salva refresh token nos cookies
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      reply.status(400).send({
        message: `[400] Bad Request: ${err.message}`,
      })
    }

    throw err
  }
}
