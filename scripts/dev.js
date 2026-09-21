#!/usr/bin/env node
/**
 * Скрипт для запуска development окружения
 * Запускает одновременно frontend и backend
 */

const { spawn } = require('child_process');
const path = require('path');

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function startBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = path.join(__dirname, '..', 'finhance-backend');
    
    colorLog('cyan', '🚀 Запуск Backend API...');
    
    const backend = spawn('python', ['start.py'], {
      cwd: backendPath,
      stdio: 'pipe',
      shell: true
    });

    backend.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Uvicorn running')) {
        colorLog('green', '✅ Backend API запущен на http://localhost:8000');
        resolve(backend);
      }
      process.stdout.write(`${colors.blue}[Backend]${colors.reset} ${output}`);
    });

    backend.stderr.on('data', (data) => {
      const output = data.toString();
      if (!output.includes('INFO')) {
        process.stderr.write(`${colors.red}[Backend Error]${colors.reset} ${output}`);
      }
    });

    backend.on('error', (error) => {
      colorLog('red', `❌ Ошибка запуска Backend: ${error.message}`);
      reject(error);
    });

    backend.on('close', (code) => {
      if (code !== 0) {
        colorLog('red', `❌ Backend завершился с кодом ${code}`);
      }
    });
  });
}

function startFrontend() {
  return new Promise((resolve, reject) => {
    colorLog('cyan', '🚀 Запуск Frontend...');
    
    const frontend = spawn('npm', ['run', 'dev:frontend'], {
      stdio: 'pipe',
      shell: true
    });

    frontend.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:')) {
        colorLog('green', '✅ Frontend запущен на http://localhost:3000');
        resolve(frontend);
      }
      process.stdout.write(`${colors.magenta}[Frontend]${colors.reset} ${output}`);
    });

    frontend.stderr.on('data', (data) => {
      const output = data.toString();
      if (!output.includes('warn')) {
        process.stderr.write(`${colors.red}[Frontend Error]${colors.reset} ${output}`);
      }
    });

    frontend.on('error', (error) => {
      colorLog('red', `❌ Ошибка запуска Frontend: ${error.message}`);
      reject(error);
    });

    frontend.on('close', (code) => {
      if (code !== 0) {
        colorLog('red', `❌ Frontend завершился с кодом ${code}`);
      }
    });
  });
}

async function main() {
  console.clear();
  colorLog('bright', '🎯 Finhance Development Environment');
  colorLog('bright', '=====================================');
  
  try {
    // Запускаем backend и frontend параллельно
    const [backend, frontend] = await Promise.all([
      startBackend(),
      startFrontend()
    ]);

    colorLog('green', '\n🎉 Оба сервера запущены!');
    colorLog('yellow', '📡 Backend API: http://localhost:8000');
    colorLog('yellow', '🌐 Frontend: http://localhost:3000');
    colorLog('yellow', '📚 API Docs: http://localhost:8000/docs');
    colorLog('cyan', '\n💡 Для остановки нажмите Ctrl+C');

    // Обработка сигналов завершения
    process.on('SIGINT', () => {
      colorLog('yellow', '\n🛑 Остановка серверов...');
      backend.kill('SIGINT');
      frontend.kill('SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      backend.kill('SIGTERM');
      frontend.kill('SIGTERM');
      process.exit(0);
    });

  } catch (error) {
    colorLog('red', `❌ Ошибка запуска: ${error.message}`);
    process.exit(1);
  }
}

main();
