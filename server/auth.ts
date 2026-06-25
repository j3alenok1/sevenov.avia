import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

const JWT_SECRET = process.env.JWT_SECRET ?? 'semenovavia-dev-secret-change-me'

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'admin123'
}

export function createToken(): string {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyPassword(password: string): boolean {
  return password === getAdminPassword()
}

export type AuthRequest = Request & { admin?: boolean }

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Требуется авторизация' })
    return
  }

  try {
    const token = header.slice(7)
    jwt.verify(token, JWT_SECRET)
    req.admin = true
    next()
  } catch {
    res.status(401).json({ error: 'Сессия истекла, войдите снова' })
  }
}
