# Установка базового образа Node.js
FROM node:20-alpine

# Устанавливаем необходимые системные зависимости (включая openssl для Prisma)
RUN apk add --no-cache openssl bash

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY prisma ./prisma/

# Устанавливаем зависимости корневого проекта
RUN npm install

# Устанавливаем зависимости фронтенда
RUN cd frontend && npm install

# Копируем все остальные файлы проекта
COPY . .

# Генерируем клиент Prisma
RUN npx prisma generate

# Собираем фронтенд
RUN cd frontend && npm run build

# Собираем бэкенд
RUN npm run build:backend

# Открываем порт, который использует приложение
EXPOSE 3000

# Проверяем переменную окружения и запускаем приложение
CMD echo "DATABASE_URL is: ${DATABASE_URL:0:15}..." && npx prisma db push --accept-data-loss && node dist/server.js
