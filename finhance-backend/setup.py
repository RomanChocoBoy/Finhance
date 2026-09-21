#!/usr/bin/env python3
"""
Скрипт для первоначальной настройки backend
"""
import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Выполнить команду и показать результат"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - успешно")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - ошибка:")
        print(f"   {e.stderr}")
        return False

def main():
    print("🚀 Настройка Finhance Backend...")
    print("=" * 50)
    
    # Проверяем Python
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Требуется Python 3.8 или выше")
        sys.exit(1)
    
    print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # Создаем .env файл если его нет
    env_file = Path(".env")
    env_example = Path("env.example")
    
    if not env_file.exists() and env_example.exists():
        print("📝 Создание .env файла...")
        with open(env_example, 'r') as src, open(env_file, 'w') as dst:
            dst.write(src.read())
        print("✅ .env файл создан на основе env.example")
        print("⚠️  Не забудьте настроить переменные в .env файле!")
    
    # Устанавливаем зависимости
    if not run_command("pip install -r requirements.txt", "Установка зависимостей"):
        print("❌ Не удалось установить зависимости")
        sys.exit(1)
    
    print("\n🎉 Настройка завершена!")
    print("📋 Следующие шаги:")
    print("   1. Настройте базу данных PostgreSQL")
    print("   2. Обновите DATABASE_URL в .env файле")
    print("   3. Запустите: python start.py")

if __name__ == "__main__":
    main()
