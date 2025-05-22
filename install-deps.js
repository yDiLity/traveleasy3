// Скрипт для установки недостающих зависимостей
const { execSync } = require('child_process');

try {
  console.log('Установка недостающих зависимостей...');
  
  // Установка critters - пакет для оптимизации CSS
  console.log('Установка critters...');
  execSync('npm install critters', { stdio: 'inherit' });
  
  // Установка @next/font - пакет для работы с шрифтами
  console.log('Установка @next/font...');
  execSync('npm install @next/font', { stdio: 'inherit' });
  
  console.log('Зависимости успешно установлены!');
} catch (error) {
  console.error('Ошибка при установке зависимостей:', error.message);
  process.exit(1);
}
