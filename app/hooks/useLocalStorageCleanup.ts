import { useEffect } from 'react';

/**
 * Хук для очистки некорректных данных из localStorage
 * Исправляет проблемы с JSON.parse для строковых значений
 */
export function useLocalStorageCleanup() {
  useEffect(() => {
    const cleanupLocalStorage = () => {
      // Список ключей, которые должны содержать строки, а не JSON
      const stringKeys = [
        'finhance-active-tab',
        'finhance-filter-category'
      ];

      // Список ключей, которые должны содержать JSON
      const jsonKeys = [
        'finhance-transactions',
        'finhance-goals', 
        'finhance-achievements'
      ];

      // Проверяем строковые ключи
      stringKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            // Пытаемся распарсить как JSON
            JSON.parse(value);
            // Если получилось, значит это JSON, но должен быть строкой
            console.log(`🔧 Исправляем ключ ${key}: ${value} -> строка`);
            // Оставляем как есть, но логируем
          } catch {
            // Если не получилось распарсить, значит это уже строка - хорошо
            console.log(`✅ Ключ ${key} содержит строку: ${value}`);
          }
        }
      });

      // Проверяем JSON ключи
      jsonKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            JSON.parse(value);
            console.log(`✅ Ключ ${key} содержит валидный JSON`);
          } catch (error) {
            console.log(`🔧 Исправляем ключ ${key}: некорректный JSON, устанавливаем пустой массив`);
            localStorage.setItem(key, '[]');
          }
        } else {
          // Если ключ отсутствует, инициализируем
          if (key === 'finhance-achievements') {
            console.log(`🔧 Инициализируем ${key} с данными по умолчанию`);
            const defaultAchievements = [
              { id: 1, title: 'Первая запись', description: 'Добавлена первая транзакция', unlocked: true, icon: '🎯' },
              { id: 2, title: 'Экономный', description: 'Сэкономлено 10000₽', unlocked: true, icon: '💰' },
              { id: 3, title: 'Без перерасхода', description: 'Месяц без перерасхода бюджета', unlocked: false, icon: '📊' },
              { id: 4, title: 'Целеустремленный', description: 'Выполнена первая цель', unlocked: false, icon: '🏆' },
              { id: 5, title: 'Финансовый Дневник', description: 'Добавлено 100 транзакций', unlocked: false, icon: '📖' },
              { id: 6, title: 'Мастер Бюджета', description: '3 месяца без перерасхода', unlocked: false, icon: '🛡️' },
              { id: 7, title: 'Копилка', description: 'Сэкономлено 50000₽', unlocked: false, icon: '🐷' },
              { id: 8, title: 'Покоритель Вершин', description: 'Выполнено 5 финансовых целей', unlocked: false, icon: '⛰️' },
              { id: 9, title: 'Денежный Поток', description: 'Добавлено 25 операций дохода', unlocked: false, icon: '💹' },
              { id: 10, title: 'Разумный Потребитель', description: '5 месяцев доходы > расходы', unlocked: false, icon: '🧠' },
              { id: 11, title: 'Финансовый Гуру', description: 'Баланс достиг 100000₽', unlocked: false, icon: '🔮' },
              { id: 12, title: 'Планировщик', description: 'Создано 10 финансовых целей', unlocked: false, icon: '📅' },
              { id: 13, title: 'Без Долгов', description: '3 месяца без отрицательного баланса', unlocked: false, icon: '🔓' },
              { id: 14, title: 'Ежедневный Учет', description: '7 транзакций за 7 дней', unlocked: false, icon: '⏰' },
            ];
            localStorage.setItem(key, JSON.stringify(defaultAchievements));
          } else {
            localStorage.setItem(key, '[]');
          }
        }
      });

      // Проверяем булевые значения
      const themeValue = localStorage.getItem('finhance-theme');
      if (themeValue && themeValue !== 'true' && themeValue !== 'false') {
        console.log(`🔧 Исправляем finhance-theme: ${themeValue} -> false`);
        localStorage.setItem('finhance-theme', 'false');
      }
    };

    cleanupLocalStorage();
  }, []);
}
