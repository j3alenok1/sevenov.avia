import { createPool } from '@vercel/postgres'
import type { Lead, LeadInput } from './types.js'

function getConnectionString(): string | undefined {
  return (
    process.env.POSTGRES_URL
    ?? process.env.DATABASE_URL
    ?? process.env.PRISMA_DATABASE_URL
    ?? process.env.STORAGE_URL
  )
}

let pool: ReturnType<typeof createPool> | null = null

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString()
    if (!connectionString) {
      throw new Error('Не задан URL базы. Выполните: npx vercel env pull .env.local')
    }
    pool = createPool({ connectionString })
  }
  return pool
}

const MIGRATE_SQL = `
  CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    admin_notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

let migrated = false

export async function ensureSchema(): Promise<void> {
  if (migrated) return
  await getPool().query(MIGRATE_SQL)
  migrated = true
}

function mapRow(row: Record<string, unknown>): Lead {
  return {
    id: Number(row.id),
    name: String(row.name),
    phone: String(row.phone),
    message: String(row.message ?? ''),
    status: row.status as Lead['status'],
    admin_notes: String(row.admin_notes ?? ''),
    created_at: new Date(String(row.created_at)).toISOString(),
    updated_at: new Date(String(row.updated_at)).toISOString(),
  }
}

export async function getAllLeads(): Promise<Lead[]> {
  await ensureSchema()
  const { rows } = await getPool().sql`
    SELECT id, name, phone, message, status, admin_notes, created_at, updated_at
    FROM leads ORDER BY created_at DESC
  `
  return rows.map(mapRow)
}

export async function getLeadById(id: number): Promise<Lead | undefined> {
  await ensureSchema()
  const { rows } = await getPool().sql`
    SELECT id, name, phone, message, status, admin_notes, created_at, updated_at
    FROM leads WHERE id = ${id}
  `
  return rows[0] ? mapRow(rows[0]) : undefined
}

export async function createLead(input: LeadInput): Promise<Lead> {
  await ensureSchema()
  const { rows } = await getPool().sql`
    INSERT INTO leads (name, phone, message)
    VALUES (${input.name.trim()}, ${input.phone.trim()}, ${(input.message ?? '').trim()})
    RETURNING id, name, phone, message, status, admin_notes, created_at, updated_at
  `
  return mapRow(rows[0])
}

export async function updateLead(id: number, input: LeadInput): Promise<Lead | undefined> {
  await ensureSchema()
  const existing = await getLeadById(id)
  if (!existing) return undefined

  const { rows } = await getPool().sql`
    UPDATE leads SET
      name = ${input.name.trim()},
      phone = ${input.phone.trim()},
      message = ${(input.message ?? '').trim()},
      status = ${input.status ?? existing.status},
      admin_notes = ${(input.admin_notes ?? '').trim()},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, name, phone, message, status, admin_notes, created_at, updated_at
  `
  return rows[0] ? mapRow(rows[0]) : undefined
}

export async function deleteLead(id: number): Promise<boolean> {
  await ensureSchema()
  const { rowCount } = await getPool().sql`DELETE FROM leads WHERE id = ${id}`
  return (rowCount ?? 0) > 0
}

export async function getStats(): Promise<{ total: number; byStatus: { status: string; count: number }[] }> {
  await ensureSchema()
  const { rows: byStatus } = await getPool().sql`
    SELECT status, COUNT(*)::int as count FROM leads GROUP BY status
  `
  const { rows: totalRows } = await getPool().sql`SELECT COUNT(*)::int as count FROM leads`
  return {
    total: Number(totalRows[0]?.count ?? 0),
    byStatus: byStatus.map((r) => ({ status: String(r.status), count: Number(r.count) })),
  }
}

export async function runMigration(): Promise<void> {
  await getPool().query(MIGRATE_SQL)
  migrated = true
}
