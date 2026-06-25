import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createToken, verifyPassword } from '../../lib/auth.js'
import { json, methodNotAllowed, readBody } from '../../lib/api-utils.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  const { password } = readBody<{ password?: string }>(req)
  if (!password || !verifyPassword(password)) {
    return json(res, 401, { error: 'Неверный пароль' })
  }

  return json(res, 200, { token: createToken() })
}
