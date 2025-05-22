// Скрипт для запуска сервера разработки Next.js
const { execSync } = require('child_process');
const path = require('path');

// Путь к исполняемому файлу Next.js
const nextBinPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

try {
  console.log('Запуск сервера разработки Next.js...');
  
  // Запускаем сервер разработки
  execSync(`node "${nextBinPath}" dev`, { stdio: 'inherit' });
} catch (error) {
  console.error('Ошибка при запуске сервера разработки:', error.message);
  process.exit(1);
}
