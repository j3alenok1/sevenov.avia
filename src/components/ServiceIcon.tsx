import type { ReactNode } from 'react'

export function ServiceIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    herbicide: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22V12M12 12C12 12 8 8 8 4a4 4 0 018 0c0 4-4 8-4 8z" />
        <path d="M6 18h12" strokeLinecap="round" />
      </svg>
    ),
    insecticide: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="14" rx="5" ry="6" />
        <circle cx="12" cy="6" r="3" />
        <path d="M7 10L4 6M17 10l3-4M7 16l-3 3M17 16l3 3" />
      </svg>
    ),
    chemicals: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 3h6v4l4 10a2 2 0 01-2 2H7a2 2 0 01-2-2L9 7V3z" />
        <path d="M9 3h6" />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
        <circle cx="14" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    fertilizer: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4M8 6h8" />
        <path d="M6 10c0 4 2.5 8 6 12 3.5-4 6-8 6-12H6z" />
        <path d="M10 14h4" />
      </svg>
    ),
    disease: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8M12 8v8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    orchard: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22V12" />
        <circle cx="12" cy="8" r="6" />
        <path d="M8 6c-2 1-3 3-3 5M16 6c2 1 3 3 3 5" />
      </svg>
    ),
  }

  return <>{icons[name] ?? icons.chemicals}</>
}
