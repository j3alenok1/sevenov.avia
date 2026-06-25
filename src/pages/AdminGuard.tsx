import { type ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getToken } from '../api/client'

export function AdminGuard({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(Boolean(getToken()))
    setReady(true)
  }, [])

  if (!ready) return null
  if (!authed) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
