import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setToken } from '../api/client'
import './Admin.css'

export function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await api.login(password)
      setToken(token)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin admin--login">
      <div className="admin__login-card">
        <h1>Семёнов Авиа</h1>
        <p>Админ-панель заявок</p>
        <form onSubmit={handleSubmit}>
          <label className="admin__field">
            <span>Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              autoFocus
            />
          </label>
          {error && <p className="admin__error">{error}</p>}
          <button type="submit" className="btn btn-primary admin__btn-full" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <a href="/" className="admin__back">← На сайт</a>
      </div>
    </div>
  )
}
