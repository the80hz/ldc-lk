# LDC LK Login

Одностраничная форма входа в личный кабинет на React и Vite.

## Локальный запуск

```bash
npm install
npm run dev
```

Приложение будет доступно на `http://127.0.0.1:5173/`.

## Production-сборка

```bash
npm run build
```

Готовые файлы появятся в `dist/`.

## Docker

Сборка образа:

```bash
docker build -t ldc-lk-login .
```

Запуск контейнера:

```bash
docker run --rm -p 8080:80 ldc-lk-login
```

Сайт будет доступен на `http://127.0.0.1:8080/`.

## Docker Compose

```bash
docker compose up --build
```

Остановка:

```bash
docker compose down
```

Контейнер отдает статику через nginx и имеет healthcheck `/healthz`.
