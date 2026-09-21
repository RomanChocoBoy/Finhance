#!/usr/bin/env node
/**
 * Скрипт для установки зависимостей backend
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPython() {
  return new Promise((resolve, reject) => {
    colorLog('cyan', '🐍 Проверка Python...');
    
    const python = spawn('python', ['--version'], { shell: true });
    
    python.stdout.on('data', (data) => {
      const version = data.toString().trim();
      colorLog('green', `✅ ${version}`);
      resolve();
    });
    
    python.stderr.on('data', (data) => {
      const error = data.toString();
      colorLog('red', `❌ Python не найден: ${error}`);
      reject(new Error('Python не установлен'));
    });
    
    python.on('error', (error) => {
      colorLog('red', `❌ Ошибка проверки Python: ${error.message}`);
      reject(error);
    });
  });
}

function installBackendDependencies() {
  return new Promise((resolve, reject) => {
    const backendPath = path.join(__dirname, '..', 'finhance-backend');
    
    // Проверяем существование requirements.txt
    const requirementsPath = path.join(backendPath, 'requirements.txt');
    if (!fs.existsSync(requirementsPath)) {
      colorLog('red', '❌ Файл requirements.txt не найден в backend');
      reject(new Error('requirements.txt не найден'));
      return;
    }
    
    colorLog('cyan', '📦 Установка зависимостей backend...');
    
    const pip = spawn('pip', ['install', '-r', 'requirements.txt'], {
      cwd: backendPath,
      stdio: 'inherit',
      shell: true
    });
    
    pip.on('close', (code) => {
      if (code === 0) {
        colorLog('green', '✅ Зависимости backend установлены');
        resolve();
      } else {
        colorLog('red', `❌ Ошибка установки зависимостей (код: ${code})`);
        reject(new Error(`pip install завершился с кодом ${code}`));
      }
    });
    
    pip.on('error', (error) => {
      colorLog('red', `❌ Ошибка запуска pip: ${error.message}`);
      reject(error);
    });
  });
}

function setupBackendEnv() {
  const backendPath = path.join(__dirname, '..', 'finhance-backend');
  const envPath = path.join(backendPath, '.env');
  const envExamplePath = path.join(backendPath, 'env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    colorLog('cyan', '📝 Создание .env файла...');
    
    try {
      const envExample = fs.readFileSync(envExamplePath, 'utf8');
      fs.writeFileSync(envPath, envExample);
      colorLog('green', '✅ .env файл создан');
      colorLog('yellow', '⚠️  Не забудьте настроить переменные в .env файле!');
    } catch (error) {
      colorLog('red', `❌ Ошибка создания .env файла: ${error.message}`);
    }
  } else if (fs.existsSync(envPath)) {
    colorLog('green', '✅ .env файл уже существует');
  }
}

async function main() {
  console.clear();
  colorLog('bright', '🔧 Установка Backend Dependencies');
  colorLog('bright', '==================================');
  
  try {
    await checkPython();
    setupBackendEnv();
    await installBackendDependencies();
    
    colorLog('green', '\n🎉 Backend готов к работе!');
    colorLog('yellow', '📋 Следующие шаги:');
    colorLog('yellow', '   1. Настройте базу данных PostgreSQL');
    colorLog('yellow', '   2. Обновите DATABASE_URL в .env файле');
    colorLog('yellow', '   3. Запустите: npm run dev');
    
  } catch (error) {
    colorLog('red', `❌ Ошибка установки: ${error.message}`);
    process.exit(1);
  }
}

main();
