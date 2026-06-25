# Семёнов Авиа — сайт

Сайт сельскохозяйственной авиации с базой заявок (Vercel Postgres) и админ-панелью.

## Стек

- **Фронтенд:** Vite + React
- **API:** Vercel Serverless Functions (`api/`)
- **База:** Vercel Postgres (переменная `STORAGE_URL`)

## Локальная разработка

```bash
cp .env.example .env.local
npx vercel link
npx vercel env pull .env.local
```

Добавьте в `.env.local` (или в Vercel Dashboard):

```
ADMIN_PASSWORD=ваш_пароль
JWT_SECRET=случайная_длинная_строка
```

```bash
npm install
npm run migrate
npm run dev
```

- Сайт и API: http://localhost:3000
- Админка: http://localhost:3000/admin

## Деплой на Vercel

1. Подключите интеграцию **Postgres** к проекту `sevenov-avia` (префикс `STORAGE`)
2. В Vercel → Settings → Environment Variables задайте `ADMIN_PASSWORD` и `JWT_SECRET`
3. Деплой:

```bash
npx vercel deploy --prod
```

После первого деплоя выполните миграцию (один раз):

```bash
npm run migrate
```

Или таблица создастся автоматически при первой заявке с сайта.

## Админ-панель

- URL: `/admin`
- Пароль: из `ADMIN_PASSWORD`
- Просмотр, редактирование, удаление заявок

## Настройка контента

`src/config/site.ts` — телефон, цены, тексты, Instagram.
