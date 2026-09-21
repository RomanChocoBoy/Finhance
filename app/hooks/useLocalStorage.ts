import { useState, useEffect } from 'react';
import { Transaction, Goal, Achievement } from '../types';

/**
 * Хук для работы с localStorage
 * Автоматически сохраняет и загружает данные из localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Получаем значение из localStorage или используем начальное значение
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      // Проверяем, является ли значение JSON
      if (item.startsWith('{') || item.startsWith('[') || item === 'true' || item === 'false' || item === 'null' || /^-?\d+\.?\d*$/.test(item)) {
        return JSON.parse(item);
      } else {
        // Если это обычная строка, возвращаем её как есть
        return item as T;
      }
    } catch (error) {
      console.error(`Ошибка загрузки данных из localStorage для ключа "${key}":`, error);
      return initialValue;
    }
  });

  // Функция для обновления значения
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Позволяем value быть функцией, чтобы обновлять состояние на основе предыдущего значения
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Сохраняем в состояние
      setStoredValue(valueToStore);
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        // Если это строка, сохраняем как есть, иначе как JSON
        if (typeof valueToStore === 'string') {
          window.localStorage.setItem(key, valueToStore);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Ошибка сохранения данных в localStorage для ключа "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Хук для работы с массивом данных в localStorage
 * Предоставляет удобные методы для добавления, обновления и удаления элементов
 */
export function useLocalStorageArray<T extends { id: number }>(
  key: string,
  initialValue: T[] = []
) {
  const [items, setItems] = useLocalStorage<T[]>(key, initialValue);

  // Добавить новый элемент
  const addItem = (item: Omit<T, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now() + Math.random() // Уникальный ID
    } as T;
    
    setItems(prev => [newItem, ...prev]);
    return newItem;
  };

  // Обновить существующий элемент
  const updateItem = (id: number, updates: Partial<T>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  // Удалить элемент
  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Получить элемент по ID
  const getItem = (id: number) => {
    return items.find(item => item.id === id);
  };

  // Очистить все элементы
  const clearItems = () => {
    setItems([]);
  };

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    getItem,
    clearItems,
    setItems
  };
}

/**
 * Хук для работы с настройками приложения
 */
export function useAppSettings() {
  const [activeTab, setActiveTab] = useLocalStorage('finhance-active-tab', 'dashboard');
  const [filterCategory, setFilterCategory] = useLocalStorage('finhance-filter-category', 'all');

  return {
    activeTab,
    setActiveTab,
    filterCategory,
    setFilterCategory
  };
}

/**
 * Хук для работы с данными приложения
 */
export function useAppData() {
  const transactions = useLocalStorageArray<Transaction>('finhance-transactions', []);
  const goals = useLocalStorageArray<Goal>('finhance-goals', []);
  const achievements = useLocalStorageArray<Achievement>('finhance-achievements', []);

  // Принудительно инициализируем достижения, если их нет
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAchievements = localStorage.getItem('finhance-achievements');
      if (!storedAchievements || storedAchievements === '[]' || storedAchievements === 'null') {
        console.log('🔧 Принудительная инициализация достижений в useAppData');
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
        localStorage.setItem('finhance-achievements', JSON.stringify(defaultAchievements));
        // Обновляем состояние
        achievements.setItems(defaultAchievements);
      }
    }
  }, []);

  return {
    transactions,
    goals,
    achievements
  };
}

/**
 * Хук для экспорта и импорта данных
 */
export function useDataExport() {
  // Экспорт всех данных
  const exportData = () => {
    const data = {
      transactions: JSON.parse(localStorage.getItem('finhance-transactions') || '[]'),
      goals: JSON.parse(localStorage.getItem('finhance-goals') || '[]'),
      achievements: JSON.parse(localStorage.getItem('finhance-achievements') || '[]'),
      settings: {
        theme: localStorage.getItem('finhance-theme') === 'true',
        activeTab: localStorage.getItem('finhance-active-tab') || 'dashboard',
        filterCategory: localStorage.getItem('finhance-filter-category') || 'all'
      },
      exportDate: new Date().toISOString(),
      version: '0.0.1'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finhance-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Импорт данных
  const importData = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          // Проверяем версию и структуру данных
          if (!data.version || !data.transactions || !data.goals || !data.achievements) {
            throw new Error('Неверный формат файла');
          }

          // Сохраняем данные в localStorage
          localStorage.setItem('finhance-transactions', JSON.stringify(data.transactions));
          localStorage.setItem('finhance-goals', JSON.stringify(data.goals));
          localStorage.setItem('finhance-achievements', JSON.stringify(data.achievements));
          
          if (data.settings) {
            localStorage.setItem('finhance-theme', data.settings.theme.toString());
            localStorage.setItem('finhance-active-tab', data.settings.activeTab);
            localStorage.setItem('finhance-filter-category', data.settings.filterCategory);
          }

          resolve(true);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsText(file);
    });
  };

  // Очистка всех данных
  const clearAllData = () => {
    localStorage.removeItem('finhance-transactions');
    localStorage.removeItem('finhance-goals');
    localStorage.removeItem('finhance-achievements');
    localStorage.removeItem('finhance-theme');
    localStorage.removeItem('finhance-active-tab');
    localStorage.removeItem('finhance-filter-category');
  };

  return {
    exportData,
    importData,
    clearAllData
  };
}
