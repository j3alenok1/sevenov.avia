import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { authRouter } from './routes/auth.js'
import { leadsRouter } from './routes/leads.js'
import { authMiddleware } from './auth.js'
import { db } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 3001
const distPath = join(__dirname, '..', 'dist')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/leads', leadsRouter)

app.get('/api/admin/stats', authMiddleware, (_req, res) => {
  const byStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM leads GROUP BY status
  `).all()
  const total = db.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number }
  res.json({ total: total.count, byStatus })
})

if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`)
  if (existsSync(distPath)) {
    console.log(`Сайт: http://localhost:${PORT}`)
  }
})
