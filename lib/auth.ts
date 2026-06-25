import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'semenovavia-dev-secret-change-me'

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'admin'
}

export function createToken(): string {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyPassword(password: string): boolean {
  return password === getAdminPassword()
}

export function verifyToken(header: string | undefined): boolean {
  if (!header?.startsWith('Bearer ')) return false
  try {
    jwt.verify(header.slice(7), JWT_SECRET)
    return true
  } catch {
    return false
  }
}
