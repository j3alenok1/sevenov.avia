import pg from 'pg'
import type { Lead, LeadInput } from './types.js'

const { Pool } = pg

let pooledPool: pg.Pool | null = null
let directPool: pg.Pool | null = null

function pickEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim()
    if (value) return value
  }
  return undefined
}

function toDirectUrl(url: string): string {
  return url
    .replace('pooled.db.prisma.io', 'db.prisma.io')
    .replace('-pooler.', '.')
}

function getPooledConnectionString(): string {
  const url = pickEnv('DATABASE_URL', 'POSTGRES_URL', 'PRISMA_DATABASE_URL', 'STORAGE_URL')
  if (!url) {
    throw new Error(
      'Не задан URL базы (DATABASE_URL / POSTGRES_URL). Подключите Prisma Postgres в Vercel.'
    )
  }
  return url
}

function getDirectConnectionString(): string {
  const direct = pickEnv('POSTGRES_URL_NON_POOLING')
  if (direct) return direct

  const pooled = pickEnv('DATABASE_URL', 'POSTGRES_URL', 'PRISMA_DATABASE_URL', 'STORAGE_URL')
  if (pooled) return toDirectUrl(pooled)

  throw new Error(
    'Не задан URL базы (DATABASE_URL / POSTGRES_URL). Подключите Prisma Postgres в Vercel.'
  )
}

function createPool(connectionString: string): pg.Pool {
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  })
}

function getPooledPool(): pg.Pool {
  if (!pooledPool) {
    pooledPool = createPool(getPooledConnectionString())
  }
  return pooledPool
}

function getDirectPool(): pg.Pool {
  if (!directPool) {
    directPool = createPool(getDirectConnectionString())
  }
  return directPool
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

const LEAD_COLUMNS =
  'id, name, phone, message, status, admin_notes, created_at, updated_at'

let migrated = false

export async function ensureSchema(): Promise<void> {
  if (migrated) return
  await getDirectPool().query(MIGRATE_SQL)
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
  const { rows } = await getPooledPool().query(
    `SELECT ${LEAD_COLUMNS} FROM leads ORDER BY created_at DESC`
  )
  return rows.map(mapRow)
}

export async function getLeadById(id: number): Promise<Lead | undefined> {
  await ensureSchema()
  const { rows } = await getPooledPool().query(
    `SELECT ${LEAD_COLUMNS} FROM leads WHERE id = $1`,
    [id]
  )
  return rows[0] ? mapRow(rows[0]) : undefined
}

export async function createLead(input: LeadInput): Promise<Lead> {
  await ensureSchema()
  const { rows } = await getPooledPool().query(
    `INSERT INTO leads (name, phone, message)
     VALUES ($1, $2, $3)
     RETURNING ${LEAD_COLUMNS}`,
    [input.name.trim(), input.phone.trim(), (input.message ?? '').trim()]
  )
  if (!rows[0]) {
    throw new Error('Не удалось сохранить заявку')
  }
  return mapRow(rows[0])
}

export async function updateLead(id: number, input: LeadInput): Promise<Lead | undefined> {
  await ensureSchema()
  const existing = await getLeadById(id)
  if (!existing) return undefined

  const { rows } = await getPooledPool().query(
    `UPDATE leads SET
      name = $1,
      phone = $2,
      message = $3,
      status = $4,
      admin_notes = $5,
      updated_at = NOW()
     WHERE id = $6
     RETURNING ${LEAD_COLUMNS}`,
    [
      input.name.trim(),
      input.phone.trim(),
      (input.message ?? '').trim(),
      input.status ?? existing.status,
      (input.admin_notes ?? '').trim(),
      id,
    ]
  )
  return rows[0] ? mapRow(rows[0]) : undefined
}

export async function deleteLead(id: number): Promise<boolean> {
  await ensureSchema()
  const { rowCount } = await getPooledPool().query('DELETE FROM leads WHERE id = $1', [id])
  return (rowCount ?? 0) > 0
}

export async function getStats(): Promise<{ total: number; byStatus: { status: string; count: number }[] }> {
  await ensureSchema()
  const { rows: byStatus } = await getPooledPool().query(
    'SELECT status, COUNT(*)::int as count FROM leads GROUP BY status'
  )
  const { rows: totalRows } = await getPooledPool().query(
    'SELECT COUNT(*)::int as count FROM leads'
  )
  return {
    total: Number(totalRows[0]?.count ?? 0),
    byStatus: byStatus.map((r) => ({ status: String(r.status), count: Number(r.count) })),
  }
}

export async function runMigration(): Promise<void> {
  const pool = createPool(getDirectConnectionString())
  try {
    await pool.query(MIGRATE_SQL)
    migrated = true
  } finally {
    await pool.end()
  }
}
