import { createClient, createPool, postgresConnectionString } from '@vercel/postgres'
import type { VercelClient, VercelPool } from '@vercel/postgres'
import type { Lead, LeadInput } from './types.js'

type DbHandle = {
  sql: VercelPool['sql']
  query: (text: string) => Promise<unknown>
}

let db: DbHandle | null = null

function isPooledUrl(url: string): boolean {
  return url.includes('-pooler.') || url.includes('localhost') || url.includes('127.0.0.1')
}

function getDb(): DbHandle {
  if (db) return db

  const poolUrl = postgresConnectionString('pool') ?? process.env.STORAGE_URL

  if (poolUrl && isPooledUrl(poolUrl)) {
    const pool: VercelPool = createPool({ connectionString: poolUrl })
    db = pool
    return pool
  }

  const directUrl =
    postgresConnectionString('direct')
    ?? process.env.DATABASE_URL
    ?? process.env.PRISMA_DATABASE_URL
    ?? (poolUrl && !isPooledUrl(poolUrl) ? poolUrl : undefined)

  if (directUrl) {
    const client: VercelClient = createClient({ connectionString: directUrl })
    db = {
      sql: client.sql.bind(client),
      query: (text: string) => client.query(text),
    }
    return db
  }

  throw new Error(
    'Не задан POSTGRES_URL. Подключите Prisma Postgres в Vercel и выполните: npx vercel env pull .env.local'
  )
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
  await getDb().query(MIGRATE_SQL)
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
  const { rows } = await getDb().sql`
    SELECT id, name, phone, message, status, admin_notes, created_at, updated_at
    FROM leads ORDER BY created_at DESC
  `
  return rows.map(mapRow)
}

export async function getLeadById(id: number): Promise<Lead | undefined> {
  await ensureSchema()
  const { rows } = await getDb().sql`
    SELECT id, name, phone, message, status, admin_notes, created_at, updated_at
    FROM leads WHERE id = ${id}
  `
  return rows[0] ? mapRow(rows[0]) : undefined
}

export async function createLead(input: LeadInput): Promise<Lead> {
  await ensureSchema()
  const { rows } = await getDb().sql`
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

  const { rows } = await getDb().sql`
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
  const { rowCount } = await getDb().sql`DELETE FROM leads WHERE id = ${id}`
  return (rowCount ?? 0) > 0
}

export async function getStats(): Promise<{ total: number; byStatus: { status: string; count: number }[] }> {
  await ensureSchema()
  const { rows: byStatus } = await getDb().sql`
    SELECT status, COUNT(*)::int as count FROM leads GROUP BY status
  `
  const { rows: totalRows } = await getDb().sql`SELECT COUNT(*)::int as count FROM leads`
  return {
    total: Number(totalRows[0]?.count ?? 0),
    byStatus: byStatus.map((r) => ({ status: String(r.status), count: Number(r.count) })),
  }
}

export async function runMigration(): Promise<void> {
  const directUrl =
    postgresConnectionString('direct')
    ?? process.env.DATABASE_URL
    ?? process.env.PRISMA_DATABASE_URL

  if (!directUrl) {
    throw new Error('Для миграции нужен POSTGRES_URL_NON_POOLING или DATABASE_URL')
  }

  const client = createClient({ connectionString: directUrl })
  await client.query(MIGRATE_SQL)
  migrated = true
}
