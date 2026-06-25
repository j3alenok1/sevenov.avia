import type { VercelRequest, VercelResponse } from '@vercel/node'
import { deleteLead, getLeadById, updateLead } from '../../lib/db.js'
import { LEAD_STATUSES, type LeadStatus } from '../../lib/types.js'
import { json, methodNotAllowed, readBody, requireAuth } from '../../lib/api-utils.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = Number(req.query.id)
  if (!id || Number.isNaN(id)) {
    return json(res, 400, { error: 'Некорректный ID' })
  }

  try {
    if (req.method === 'GET') {
      if (!requireAuth(req, res)) return
      const lead = await getLeadById(id)
      if (!lead) return json(res, 404, { error: 'Заявка не найдена' })
      return json(res, 200, lead)
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return
      const { name, phone, message, status, admin_notes } = readBody<{
        name?: string
        phone?: string
        message?: string
        status?: LeadStatus
        admin_notes?: string
      }>(req)

      if (!name?.trim() || !phone?.trim()) {
        return json(res, 400, { error: 'Укажите имя и телефон' })
      }
      if (status && !LEAD_STATUSES.includes(status)) {
        return json(res, 400, { error: 'Некорректный статус' })
      }

      const lead = await updateLead(id, { name, phone, message, status, admin_notes })
      if (!lead) return json(res, 404, { error: 'Заявка не найдена' })
      return json(res, 200, lead)
    }

    if (req.method === 'DELETE') {
      if (!requireAuth(req, res)) return
      const ok = await deleteLead(id)
      if (!ok) return json(res, 404, { error: 'Заявка не найдена' })
      return json(res, 200, { success: true })
    }

    return methodNotAllowed(res, ['GET', 'PUT', 'DELETE'])
  } catch (err) {
    console.error(err)
    return json(res, 500, { error: 'Ошибка сервера' })
  }
}
