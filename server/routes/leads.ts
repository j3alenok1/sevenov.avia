import { Router } from 'express'
import { createLead, deleteLead, getAllLeads, getLeadById, updateLead, type LeadStatus } from '../db.js'
import { authMiddleware } from '../auth.js'

export const leadsRouter = Router()

const STATUSES: LeadStatus[] = ['new', 'processing', 'done', 'cancelled']

leadsRouter.post('/', (req, res) => {
  const { name, phone, message } = req.body ?? {}

  if (!name?.trim() || !phone?.trim()) {
    res.status(400).json({ error: 'Укажите имя и телефон' })
    return
  }

  const lead = createLead({ name, phone, message })
  res.status(201).json(lead)
})

leadsRouter.use(authMiddleware)

leadsRouter.get('/', (_req, res) => {
  res.json(getAllLeads())
})

leadsRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const lead = getLeadById(id)
  if (!lead) {
    res.status(404).json({ error: 'Заявка не найдена' })
    return
  }
  res.json(lead)
})

leadsRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  const { name, phone, message, status, admin_notes } = req.body ?? {}

  if (!name?.trim() || !phone?.trim()) {
    res.status(400).json({ error: 'Укажите имя и телефон' })
    return
  }

  if (status && !STATUSES.includes(status)) {
    res.status(400).json({ error: 'Некорректный статус' })
    return
  }

  const lead = updateLead(id, { name, phone, message, status, admin_notes })
  if (!lead) {
    res.status(404).json({ error: 'Заявка не найдена' })
    return
  }
  res.json(lead)
})

leadsRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const ok = deleteLead(id)
  if (!ok) {
    res.status(404).json({ error: 'Заявка не найдена' })
    return
  }
  res.json({ success: true })
})
