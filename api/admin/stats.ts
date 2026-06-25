import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getStats } from '../../lib/db.js'
import { json, methodNotAllowed, requireAuth } from '../../lib/api-utils.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  if (!requireAuth(req, res)) return

  try {
    const stats = await getStats()
    return json(res, 200, stats)
  } catch (err) {
    console.error(err)
    return json(res, 500, { error: 'Ошибка сервера' })
  }
}
