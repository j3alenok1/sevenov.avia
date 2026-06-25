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

const TOKEN_KEY = 'semenovavia_admin_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(path, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error ?? 'Ошибка запроса')
  }
  return data as T
}

export const api = {
  login(password: string) {
    return request<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  },

  submitLead(input: LeadInput) {
    return request<Lead>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  getLeads() {
    return request<Lead[]>('/api/leads')
  },

  updateLead(id: number, input: LeadInput) {
    return request<Lead>(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
  },

  deleteLead(id: number) {
    return request<{ success: boolean }>(`/api/leads/${id}`, { method: 'DELETE' })
  },

  getStats() {
    return request<{ total: number; byStatus: { status: string; count: number }[] }>('/api/admin/stats')
  },
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Новая',
  processing: 'В работе',
  done: 'Выполнена',
  cancelled: 'Отменена',
}
