import request from 'supertest'
import { app } from '@/app.js'

interface CreateOrgParams {
  name: string
  email: string
  whatsapp: string
  password: string
  address: string
  city: string
  state: string
}

export async function createOrg(org: CreateOrgParams) {
  const response = await request(app.server).post('/orgs').send(org)
  return response
}

export async function createOrgAndSession(org: CreateOrgParams) {
  const orgResponse = await request(app.server).post('/orgs').send(org)

  const sessionResponse = await request(app.server).post('/sessions').send({
    email: org.email,
    password: org.password,
  })

  const token = sessionResponse.body.token

  return {
    orgResponse,
    sessionResponse,
    token,
  }
}

export async function authenticateOrg(email: string, password: string) {
  const sessionResponse = await request(app.server).post('/sessions').send({
    email,
    password,
  })

  return sessionResponse
}