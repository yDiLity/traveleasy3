// Скрипт для запуска сервера Next.js
const { execSync } = require('child_process');
const path = require('path');

// Путь к исполняемому файлу Next.js
const nextBinPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

try {
  console.log('Запуск сервера Next.js...');
  
  // Запускаем сервер
  execSync(`node "${nextBinPath}" start`, { stdio: 'inherit' });
} catch (error) {
  console.error('Ошибка при запуске сервера:', error.message);
  process.exit(1);
}
