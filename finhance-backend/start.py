#!/usr/bin/env python3
"""
Скрипт для запуска FastAPI backend сервера
"""
import uvicorn
import os
import sys
from pathlib import Path

# Добавляем текущую директорию в Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

if __name__ == "__main__":
    # Проверяем наличие .env файла
    env_file = current_dir / ".env"
    if not env_file.exists():
        print("⚠️  Файл .env не найден. Создайте его на основе .env.example")
        print("📝 Скопируйте .env.example в .env и настройте переменные окружения")
        sys.exit(1)
    
    # Запускаем сервер
    print("🚀 Запуск Finhance Backend API...")
    print("📡 API будет доступен по адресу: http://localhost:8000")
    print("📚 Документация: http://localhost:8000/docs")
    print("🔄 Для остановки нажмите Ctrl+C")
    print("-" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[str(current_dir)],
        log_level="info"
    )
