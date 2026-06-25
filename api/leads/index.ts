import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createLead, getAllLeads } from '../../lib/db.js'
import { json, methodNotAllowed, readBody, requireAuth } from '../../lib/api-utils.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') {
      const { name, phone, message } = readBody<{ name?: string; phone?: string; message?: string }>(req)
      if (!name?.trim() || !phone?.trim()) {
        return json(res, 400, { error: 'Укажите имя и телефон' })
      }
      const lead = await createLead({ name, phone, message })
      return json(res, 201, lead)
    }

    if (req.method === 'GET') {
      if (!requireAuth(req, res)) return
      const leads = await getAllLeads()
      return json(res, 200, leads)
    }

    return methodNotAllowed(res, ['GET', 'POST'])
  } catch (err) {
    console.error(err)
    const detail = err instanceof Error ? err.message : 'Ошибка сервера'
    return json(res, 500, { error: detail })
  }
}
