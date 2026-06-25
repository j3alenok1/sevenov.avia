import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyToken } from './auth.js'

export function json(res: VercelResponse, status: number, data: unknown) {
  res.status(status).json(data)
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]) {
  res.setHeader('Allow', allowed.join(', '))
  json(res, 405, { error: 'Метод не поддерживается' })
}

export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  if (!verifyToken(req.headers.authorization)) {
    json(res, 401, { error: 'Требуется авторизация' })
    return false
  }
  return true
}

export function readBody<T>(req: VercelRequest): T {
  return (req.body ?? {}) as T
}
