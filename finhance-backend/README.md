# Finhance Backend API

Backend API для приложения управления личными финансами Finhance.

## Технологии

- **FastAPI** - современный веб-фреймворк для Python
- **SQLAlchemy** - ORM для работы с базой данных
- **PostgreSQL** - реляционная база данных
- **Pydantic** - валидация данных
- **JWT** - аутентификация
- **Alembic** - миграции базы данных

## Структура проекта

```
finhance-backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py          # Аутентификация
│   │       ├── users.py         # Управление пользователями
│   │       ├── transactions.py # Транзакции
│   │       └── goals.py         # Финансовые цели
│   ├── core/
│   │   ├── config.py           # Конфигурация
│   │   └── database.py         # Настройка БД
│   ├── models/
│   │   ├── user.py             # Модель пользователя
│   │   ├── transaction.py      # Модель транзакции
│   │   └── goal.py             # Модель цели
│   ├── schemas/
│   │   ├── user.py             # Схемы пользователя
│   │   ├── transaction.py      # Схемы транзакции
│   │   └── goal.py             # Схемы цели
│   └── services/
│       ├── auth_service.py     # Сервис аутентификации
│       ├── user_service.py     # Сервис пользователей
│       ├── transaction_service.py # Сервис транзакций
│       └── goal_service.py     # Сервис целей
├── main.py                     # Точка входа
├── requirements.txt            # Зависимости
└── README.md                   # Документация
```

## Установка и запуск

1. **Установка зависимостей:**
```bash
pip install -r requirements.txt
```

2. **Настройка базы данных:**
Создайте файл `.env` на основе `.env.example` и настройте подключение к PostgreSQL.

3. **Запуск приложения:**
```bash
python main.py
```

API будет доступен по адресу: `http://localhost:8000`

## API Endpoints

### Аутентификация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `GET /api/v1/auth/me` - Текущий пользователь

### Пользователи
- `GET /api/v1/users/me` - Профиль пользователя
- `PUT /api/v1/users/me` - Обновить профиль
- `DELETE /api/v1/users/me` - Удалить аккаунт

### Транзакции
- `POST /api/v1/transactions/` - Создать транзакцию
- `GET /api/v1/transactions/` - Список транзакций
- `GET /api/v1/transactions/summary` - Сводка по транзакциям
- `GET /api/v1/transactions/{id}` - Получить транзакцию
- `PUT /api/v1/transactions/{id}` - Обновить транзакцию
- `DELETE /api/v1/transactions/{id}` - Удалить транзакцию

### Цели
- `POST /api/v1/goals/` - Создать цель
- `GET /api/v1/goals/` - Список целей
- `GET /api/v1/goals/progress` - Прогресс по целям
- `GET /api/v1/goals/{id}` - Получить цель
- `PUT /api/v1/goals/{id}` - Обновить цель
- `POST /api/v1/goals/{id}/contribute` - Внести вклад
- `DELETE /api/v1/goals/{id}` - Удалить цель

## Документация API

После запуска приложения документация доступна по адресам:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
