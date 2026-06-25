import type { Lead, LeadStatus } from '../api/client'
import { STATUS_LABELS } from '../api/client'

function escapeCsv(value: string): string {
  const safe = value.replace(/"/g, '""')
  return `"${safe}"`
}

function formatDate(iso: string): string {
  const normalized = iso.includes('T') ? iso : iso.replace(' ', 'T')
  return new Date(normalized).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function exportLeadsToExcel(leads: Lead[]): void {
  const headers = [
    '№',
    'Дата создания',
    'Имя',
    'Телефон',
    'Сообщение',
    'Статус',
    'Заметки администратора',
    'Дата обновления',
  ]

  const rows = leads.map((lead) => [
    String(lead.id),
    formatDate(lead.created_at),
    lead.name,
    lead.phone,
    lead.message,
    STATUS_LABELS[lead.status as LeadStatus],
    lead.admin_notes,
    formatDate(lead.updated_at),
  ])

  const csv = [
    headers.map(escapeCsv).join(';'),
    ...rows.map((row) => row.map(escapeCsv).join(';')),
  ].join('\r\n')

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `zayavki_${date}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
