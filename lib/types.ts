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

export const LEAD_STATUSES: LeadStatus[] = ['new', 'processing', 'done', 'cancelled']
