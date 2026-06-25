import type { VercelRequest, VercelResponse } from '@vercel/node'
import { json, methodNotAllowed } from '../lib/api-utils.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return json(res, 200, { ok: true })
  }
  return methodNotAllowed(res, ['GET'])
}
