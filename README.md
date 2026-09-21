# Finhance - Personal Finance Management App

Полнофункциональное приложение для управления личными финансами с современным frontend на Next.js и мощным backend на FastAPI.



## 🚀 Быстрый старт

### Автоматическая установка и запуск

```bash
# Установка зависимостей
npm install

# Настройка backend (установка Python зависимостей)
npm run dev:setup

# Запуск всего приложения (frontend + backend)
npm run dev
```

### Ручная установка

#### Frontend (Next.js)
```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev:frontend
```

#### Backend (FastAPI)
```bash
# Переход в папку backend
cd finhance-backend

# Установка Python зависимостей
pip install -r requirements.txt

# Создание .env файла
cp env.example .env

# Настройка .env файла (обязательно!)
# Обновите DATABASE_URL и другие переменные

# Запуск backend
python start.py
```

## 📁 Структура проекта

```
fin-hance-nextjs/
├── app/                    # Next.js приложение
│   ├── components/         # React компоненты
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript типы
│   └── page.tsx           # Главная страница
├── finhance-backend/       # FastAPI backend
│   ├── app/               # Backend приложение
│   │   ├── api/v1/        # API маршруты
│   │   ├── core/          # Основные настройки
│   │   ├── models/        # SQLAlchemy модели
│   │   ├── schemas/       # Pydantic схемы
│   │   └── services/      # Бизнес-логика
│   ├── main.py            # Точка входа FastAPI
│   ├── start.py           # Скрипт запуска
│   └── requirements.txt   # Python зависимости
├── scripts/               # Утилиты запуска
│   ├── dev.js            # Скрипт запуска dev окружения
│   └── install-backend.js # Установка backend зависимостей
└── package.json          # Node.js зависимости
```

## 🛠 Доступные команды

### Основные команды
- `npm run dev` - Запуск полного приложения (frontend + backend)
- `npm run dev:setup` - Настройка backend зависимостей
- `npm run build` - Сборка production версии
- `npm run start` - Запуск production версии

### Отдельные сервисы
- `npm run dev:frontend` - Только frontend
- `npm run dev:backend` - Только backend
- `npm run dev:backend:install` - Установка backend зависимостей

## 🌐 Доступные URL

После запуска `npm run dev`:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Настройка

### 1. База данных
Создайте PostgreSQL базу данных и обновите `DATABASE_URL` в файле `finhance-backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/finhance_db
```

### 2. Переменные окружения
Скопируйте `finhance-backend/env.example` в `finhance-backend/.env` и настройте:

```env
# Database
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/finhance_db

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Environment
ENVIRONMENT=development
```

## 🎯 Функциональность

### Frontend (Next.js + React)
- 📊 **Dashboard** - Обзор финансов
- 💰 **Транзакции** - Управление доходами и расходами
- 🎯 **Цели** - Финансовые цели и их отслеживание
- 🏆 **Достижения** - Система достижений
- 📱 **Responsive Design** - Адаптивный дизайн

### Backend (FastAPI)
- 🔐 **Аутентификация** - JWT токены
- 👤 **Пользователи** - Управление профилем
- 💳 **Транзакции** - CRUD операции
- 🎯 **Цели** - Финансовые цели
- 📊 **Аналитика** - Сводки и отчеты

## 🚀 Развертывание

### Production сборка
```bash
# Сборка frontend
npm run build

# Запуск production
npm run start
```

### Docker (опционально)
```bash
# Создание Dockerfile для backend
# Настройка docker-compose.yml
# Запуск через Docker
```

## 📚 API Документация

После запуска backend, документация доступна по адресам:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐛 Устранение неполадок

### Backend не запускается
1. Проверьте установку Python 3.8+
2. Установите зависимости: `npm run dev:setup`
3. Настройте .env файл
4. Проверьте подключение к базе данных

### Frontend не запускается
1. Установите зависимости: `npm install`
2. Проверьте версию Node.js (18+)
3. Очистите кэш: `npm run build`

### Проблемы с базой данных
1. Убедитесь, что PostgreSQL запущен
2. Проверьте правильность DATABASE_URL
3. Создайте базу данных вручную

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

