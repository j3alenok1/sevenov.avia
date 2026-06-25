import 'dotenv/config'
import { runMigration } from '../lib/db.js'

async function main() {
  await runMigration()
  console.log('Таблица leads создана (или уже существует).')
}

main().catch((err) => {
  console.error('Ошибка миграции:', err.message)
  process.exit(1)
})
