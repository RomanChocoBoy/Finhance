'use client';

import { useState, useEffect } from 'react';

interface StorageInfoProps {
  isDarkTheme: boolean;
}

export default function StorageInfo({ isDarkTheme }: StorageInfoProps) {
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    total: 0,
    percentage: 0,
    transactions: 0,
    goals: 0,
    achievements: 0
  });

  useEffect(() => {
    const calculateStorageInfo = () => {
      if (typeof window === 'undefined') return;

      // Получаем размер localStorage
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      // Обычно localStorage имеет лимит 5-10MB
      const total = 5 * 1024 * 1024; // 5MB в байтах
      const percentage = Math.round((used / total) * 100);

      // Подсчитываем количество элементов
      const transactions = JSON.parse(localStorage.getItem('finhance-transactions') || '[]').length;
      const goals = JSON.parse(localStorage.getItem('finhance-goals') || '[]').length;
      const achievements = JSON.parse(localStorage.getItem('finhance-achievements') || '[]').length;

      setStorageInfo({
        used,
        total,
        percentage,
        transactions,
        goals,
        achievements
      });
    };

    calculateStorageInfo();

    // Обновляем информацию при изменении localStorage
    const handleStorageChange = () => {
      calculateStorageInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Также слушаем изменения в текущем окне
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, [key, value]);
      calculateStorageInfo();
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`p-4 rounded-xl border ${
      isDarkTheme 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <h3 className={`font-semibold mb-3 ${
        isDarkTheme ? 'text-white' : 'text-gray-900'
      }`}>
        📊 Информация о хранилище
      </h3>
      
      <div className="space-y-3">
        {/* Прогресс-бар использования localStorage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Использовано: {formatBytes(storageInfo.used)}
            </span>
            <span className={`text-sm ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {storageInfo.percentage}%
            </span>
          </div>
          <div className={`w-full rounded-full h-2 ${
            isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                storageInfo.percentage > 80 
                  ? 'bg-red-500' 
                  : storageInfo.percentage > 60 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Статистика элементов */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              {storageInfo.transactions}
            </div>
            <div className={`text-xs ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Транзакции
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              {storageInfo.goals}
            </div>
            <div className={`text-xs ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Цели
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              {storageInfo.achievements}
            </div>
            <div className={`text-xs ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Достижения
            </div>
          </div>
        </div>

        {/* Предупреждение о переполнении */}
        {storageInfo.percentage > 80 && (
          <div className="p-3 rounded-lg bg-yellow-100 border border-yellow-300">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">⚠️</span>
              <span className="text-sm text-yellow-800">
                localStorage почти заполнен. Рекомендуется экспортировать данные.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
