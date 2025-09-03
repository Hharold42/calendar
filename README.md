# Calendar App

Календарь с управлением встречами и статусами дней.

## Технологии

- Frontend: React 19, TypeScript, Vite, SCSS
- Backend: Node.js, Express

## Установка

```bash
# Backend
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

## API

- `GET /day-statuses` - статусы дней
- `GET /appointments` - встречи
- `POST /appointments` - создание встречи
- `GET /masters` - мастера
- `GET /services` - услуги

## Структура

```
├── client/          # React приложение
├── app.mjs         # Backend сервер
└── dev.mjs         # Dev сервер
```
