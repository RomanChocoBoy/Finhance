import { useEffect } from 'react';
import { Transaction, Goal, Achievement } from '../types';

/**
 * Хук для миграции данных из старых версий
 * Автоматически обновляет структуру данных при необходимости
 */
export function useDataMigration() {
  useEffect(() => {
    const migrateData = () => {
      // Всегда проверяем и инициализируем достижения при загрузке
      const achievements = localStorage.getItem('finhance-achievements');
      if (!achievements || achievements === '[]' || achievements === 'null' || achievements === 'undefined') {
        console.log('🔧 Достижения отсутствуют, инициализируем...');
        initializeDefaultData();
        return;
      }

      const version = localStorage.getItem('finhance-data-version') || '0.0.0';
      
      // Если версия не установлена, это первая загрузка
      if (version === '0.0.0') {
        initializeDefaultData();
        localStorage.setItem('finhance-data-version', '1.0.0');
        return;
      }

      // Миграция с версии 0.x.x на 1.0.0
      if (version.startsWith('0.')) {
        migrateFromV0ToV1();
        localStorage.setItem('finhance-data-version', '1.0.0');
      }
    };

    migrateData();
  }, []);

  // Инициализация данных по умолчанию
  const initializeDefaultData = () => {
    // Инициализируем транзакции
    if (!localStorage.getItem('finhance-transactions')) {
      const defaultTransactions: Transaction[] = [
        { id: 1, type: 'expense', amount: 500, category: 'Еда', date: '2025-10-10', description: 'Продукты' },
        { id: 2, type: 'income', amount: 50000, category: 'Зарплата', date: '2025-10-05', description: 'Месячная зарплата' },
        { id: 3, type: 'expense', amount: 1200, category: 'Транспорт', date: '2025-10-08', description: 'Проездной' },
        { id: 4, type: 'expense', amount: 800, category: 'Развлечения', date: '2025-10-12', description: 'Кино' },
      ];
      localStorage.setItem('finhance-transactions', JSON.stringify(defaultTransactions));
    }

    // Инициализируем цели
    if (!localStorage.getItem('finhance-goals')) {
      const defaultGoals: Goal[] = [
        { id: 1, title: 'Накопить на отпуск', target: 100000, current: 25000, type: 'save' },
        { id: 2, title: 'Снизить расходы на еду', target: 15000, current: 12000, type: 'reduce' },
        { id: 3, title: 'Отложить на подушку безопасности', target: 200000, current: 80000, type: 'save' },
      ];
      localStorage.setItem('finhance-goals', JSON.stringify(defaultGoals));
    }

    // Инициализируем достижения
    if (!localStorage.getItem('finhance-achievements')) {
      const defaultAchievements: Achievement[] = [
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
      localStorage.setItem('finhance-achievements', JSON.stringify(defaultAchievements));
    }

    // Инициализируем настройки
    if (!localStorage.getItem('finhance-theme')) {
      localStorage.setItem('finhance-theme', 'false');
    }
    if (!localStorage.getItem('finhance-active-tab')) {
      localStorage.setItem('finhance-active-tab', 'dashboard');
    }
    if (!localStorage.getItem('finhance-filter-category')) {
      localStorage.setItem('finhance-filter-category', 'all');
    }
  };

  // Миграция с версии 0.x.x на 1.0.0
  const migrateFromV0ToV1 = () => {
    console.log('🔄 Выполняется миграция данных с версии 0.x.x на 1.0.0');
    
    // Очищаем некорректные данные из localStorage
    const keysToCheck = ['finhance-active-tab', 'finhance-filter-category'];
    keysToCheck.forEach(key => {
      const value = localStorage.getItem(key);
      if (value && !value.startsWith('{') && !value.startsWith('[') && value !== 'true' && value !== 'false' && !/^-?\d+\.?\d*$/.test(value)) {
        // Если значение не является JSON, но это строка, оставляем как есть
        console.log(`✅ Ключ ${key} содержит строку: ${value}`);
      }
    });
    
    // Проверяем и мигрируем транзакции
    const oldTransactions = localStorage.getItem('transactions');
    if (oldTransactions && !localStorage.getItem('finhance-transactions')) {
      try {
        const transactions = JSON.parse(oldTransactions);
        localStorage.setItem('finhance-transactions', JSON.stringify(transactions));
        localStorage.removeItem('transactions');
        console.log('✅ Транзакции мигрированы');
      } catch (error) {
        console.error('❌ Ошибка миграции транзакций:', error);
      }
    }

    // Проверяем и мигрируем цели
    const oldGoals = localStorage.getItem('goals');
    if (oldGoals && !localStorage.getItem('finhance-goals')) {
      try {
        const goals = JSON.parse(oldGoals);
        localStorage.setItem('finhance-goals', JSON.stringify(goals));
        localStorage.removeItem('goals');
        console.log('✅ Цели мигрированы');
      } catch (error) {
        console.error('❌ Ошибка миграции целей:', error);
      }
    }

    // Проверяем и мигрируем достижения
    const oldAchievements = localStorage.getItem('achievements');
    if (oldAchievements && !localStorage.getItem('finhance-achievements')) {
      try {
        const achievements = JSON.parse(oldAchievements);
        localStorage.setItem('finhance-achievements', JSON.stringify(achievements));
        localStorage.removeItem('achievements');
        console.log('✅ Достижения мигрированы');
      } catch (error) {
        console.error('❌ Ошибка миграции достижений:', error);
      }
    }

    // Мигрируем настройки темы
    const oldTheme = localStorage.getItem('isDarkTheme');
    if (oldTheme && !localStorage.getItem('finhance-theme')) {
      localStorage.setItem('finhance-theme', oldTheme);
      localStorage.removeItem('isDarkTheme');
      console.log('✅ Настройки темы мигрированы');
    }

    console.log('🎉 Миграция завершена');
  };

  return {
    initializeDefaultData,
    migrateFromV0ToV1
  };
}
