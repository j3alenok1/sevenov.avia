import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'data')
mkdirSync(dataDir, { recursive: true })

const dbPath = process.env.DB_PATH ?? join(dataDir, 'leads.db')
export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    admin_notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

export type LeadStatus = 'new' | 'processing' | 'done' | 'cancelled'

export type Lead = {
  id: number
  name: string
  phone: string
  message: string
  status: LeadStatus
  admin_notes: string
  created_at: string
  updated_at: string
}

export type LeadInput = {
  name: string
  phone: string
  message?: string
  status?: LeadStatus
  admin_notes?: string
}

const leadRow = db.prepare(`
  SELECT id, name, phone, message, status, admin_notes, created_at, updated_at
  FROM leads WHERE id = ?
`)

export function getAllLeads(): Lead[] {
  return db.prepare(`
    SELECT id, name, phone, message, status, admin_notes, created_at, updated_at
    FROM leads ORDER BY created_at DESC
  `).all() as Lead[]
}

export function getLeadById(id: number): Lead | undefined {
  return leadRow.get(id) as Lead | undefined
}

export function createLead(input: LeadInput): Lead {
  const result = db.prepare(`
    INSERT INTO leads (name, phone, message) VALUES (@name, @phone, @message)
  `).run({
    name: input.name.trim(),
    phone: input.phone.trim(),
    message: (input.message ?? '').trim(),
  })
  return getLeadById(Number(result.lastInsertRowid))!
}

export function updateLead(id: number, input: LeadInput): Lead | undefined {
  const existing = getLeadById(id)
  if (!existing) return undefined

  db.prepare(`
    UPDATE leads SET
      name = @name,
      phone = @phone,
      message = @message,
      status = @status,
      admin_notes = @admin_notes,
      updated_at = datetime('now')
    WHERE id = @id
  `).run({
    id,
    name: input.name.trim(),
    phone: input.phone.trim(),
    message: (input.message ?? '').trim(),
    status: input.status ?? existing.status,
    admin_notes: (input.admin_notes ?? '').trim(),
  })

  return getLeadById(id)
}

export function deleteLead(id: number): boolean {
  const result = db.prepare('DELETE FROM leads WHERE id = ?').run(id)
  return result.changes > 0
}
