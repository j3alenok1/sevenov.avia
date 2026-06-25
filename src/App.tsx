import { Navigate, Route, Routes } from 'react-router-dom'
import { Site } from './Site'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminPage } from './pages/AdminPage'
import { AdminGuard } from './pages/AdminGuard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={(
          <AdminGuard>
            <AdminPage />
          </AdminGuard>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
