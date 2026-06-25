import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  api,
  clearToken,
  STATUS_LABELS,
  type Lead,
  type LeadStatus,
} from '../api/client'
import { exportLeadsToExcel } from '../utils/exportLeads'
import { formatPhone } from '../utils/phoneMask'
import './Admin.css'

const STATUSES: LeadStatus[] = ['new', 'processing', 'done', 'cancelled']

type EditForm = {
  name: string
  phone: string
  message: string
  status: LeadStatus
  admin_notes: string
}

function toForm(lead: Lead): EditForm {
  return {
    name: lead.name,
    phone: formatPhone(lead.phone),
    message: lead.message,
    status: lead.status,
    admin_notes: lead.admin_notes,
  }
}

export function AdminPage() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [form, setForm] = useState<EditForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [list, stats] = await Promise.all([api.getLeads(), api.getStats()])
      setLeads(list)
      setTotal(stats.total)
    } catch (err) {
      if (err instanceof Error && err.message.includes('авторизац')) {
        clearToken()
        navigate('/admin/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    load()
  }, [load])

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.status === filter)

  const openLead = (lead: Lead) => {
    setSelected(lead)
    setForm(toForm(lead))
  }

  const closeModal = () => {
    setSelected(null)
    setForm(null)
  }

  const handleSave = async () => {
    if (!selected || !form) return
    setSaving(true)
    setError('')
    try {
      const updated = await api.updateLead(selected.id, form)
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
      closeModal()
      const stats = await api.getStats()
      setTotal(stats.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить заявку безвозвратно?')) return
    try {
      await api.deleteLead(id)
      setLeads((prev) => prev.filter((l) => l.id !== id))
      if (selected?.id === id) closeModal()
      const stats = await api.getStats()
      setTotal(stats.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления')
    }
  }

  const logout = () => {
    clearToken()
    navigate('/admin/login')
  }

  const handleExport = () => {
    if (leads.length === 0) {
      setError('Нет заявок для экспорта')
      return
    }
    exportLeadsToExcel(leads)
  }

  const formatDate = (iso: string) => {
    const normalized = iso.includes('T') ? iso : iso.replace(' ', 'T')
    return new Date(normalized).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <h1>Заявки</h1>
          <p>Всего: {total}</p>
        </div>
        <div className="admin__header-actions">
          <button type="button" className="btn btn-outline" onClick={handleExport} disabled={leads.length === 0}>
            Скачать Excel
          </button>
          <button type="button" className="btn btn-outline" onClick={load}>Обновить</button>
          <a href="/" className="btn btn-outline">На сайт</a>
          <button type="button" className="btn btn-outline" onClick={logout}>Выйти</button>
        </div>
      </header>

      <div className="admin__filters">
        <button
          type="button"
          className={`admin__filter ${filter === 'all' ? 'admin__filter--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все ({leads.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`admin__filter admin__filter--${s} ${filter === s ? 'admin__filter--active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {STATUS_LABELS[s]} ({leads.filter((l) => l.status === s).length})
          </button>
        ))}
      </div>

      {error && <p className="admin__error admin__error--bar">{error}</p>}

      {loading ? (
        <p className="admin__loading">Загрузка...</p>
      ) : filtered.length === 0 ? (
        <p className="admin__empty">Заявок пока нет</p>
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Дата</th>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Сообщение</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} onClick={() => openLead(lead)}>
                  <td>{lead.id}</td>
                  <td>{formatDate(lead.created_at)}</td>
                  <td><strong>{lead.name}</strong></td>
                  <td>
                    <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()}>
                      {lead.phone}
                    </a>
                  </td>
                  <td className="admin__cell-message">{lead.message || '—'}</td>
                  <td>
                    <span className={`admin__status admin__status--${lead.status}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin__delete-btn"
                      onClick={(e) => { e.stopPropagation(); handleDelete(lead.id) }}
                      aria-label="Удалить"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && form && (
        <div className="admin__modal-overlay" onClick={closeModal}>
          <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin__modal-header">
              <h2>Заявка #{selected.id}</h2>
              <button type="button" className="admin__close" onClick={closeModal}>✕</button>
            </div>

            <p className="admin__modal-meta">
              Создана: {formatDate(selected.created_at)} · Обновлена: {formatDate(selected.updated_at)}
            </p>

            <div className="admin__modal-grid">
              <label className="admin__field">
                <span>Имя</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="admin__field">
                <span>Телефон</span>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="+7 747 126 24 75"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                />
              </label>
              <label className="admin__field admin__field--full">
                <span>Сообщение клиента</span>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </label>
              <label className="admin__field admin__field--full">
                <span>Статус</span>
                <div className="admin__status-picker">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`admin__status-option admin__status-option--${s} ${form.status === s ? 'admin__status-option--active' : ''}`}
                      onClick={() => setForm({ ...form, status: s })}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </label>
              <label className="admin__field admin__field--full">
                <span>Заметки администратора</span>
                <textarea
                  rows={3}
                  value={form.admin_notes}
                  onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
                  placeholder="Внутренние заметки, не видны клиенту"
                />
              </label>
            </div>

            <div className="admin__modal-actions">
              <button
                type="button"
                className="admin__delete-link"
                onClick={() => handleDelete(selected.id)}
              >
                Удалить заявку
              </button>
              <div className="admin__modal-buttons">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Отмена</button>
                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
