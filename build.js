// Скрипт для запуска сборки Next.js
const { execSync } = require('child_process');
const path = require('path');

// Путь к исполняемому файлу Next.js
const nextBinPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

try {
  console.log('Запуск сборки Next.js...');
  
  // Запускаем сборку
  execSync(`node "${nextBinPath}" build`, { stdio: 'inherit' });
  
  console.log('Сборка успешно завершена!');
} catch (error) {
  console.error('Ошибка при сборке:', error.message);
  process.exit(1);
}
