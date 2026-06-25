import { Router } from 'express'
import { createToken, verifyPassword } from '../auth.js'

export const authRouter = Router()

authRouter.post('/login', (req, res) => {
  const { password } = req.body ?? {}
  if (!password || !verifyPassword(password)) {
    res.status(401).json({ error: 'Неверный пароль' })
    return
  }
  res.json({ token: createToken() })
})

authRouter.post('/check', (req, res) => {
  const { password } = req.body ?? {}
  res.json({ valid: Boolean(password && verifyPassword(password)) })
})
