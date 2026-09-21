'use client';

import { useState } from 'react';
import { useDataExport } from '../hooks/useLocalStorage';
import StorageInfo from './StorageInfo';

interface DataManagerProps {
  isDarkTheme: boolean;
}

export default function DataManager({ isDarkTheme }: DataManagerProps) {
  const [showManager, setShowManager] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const { exportData, importData, clearAllData } = useDataExport();

  const handleExport = () => {
    try {
      exportData();
      setNotification({
        type: 'success',
        message: 'Данные успешно экспортированы!'
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Ошибка при экспорте данных'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importData(file)
      .then(() => {
        setNotification({
          type: 'success',
          message: 'Данные успешно импортированы! Перезагрузите страницу.'
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        setNotification({
          type: 'error',
          message: 'Ошибка при импорте данных: ' + error.message
        });
        setTimeout(() => setNotification(null), 5000);
      });
  };

  const handleClearData = () => {
    if (confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить!')) {
      clearAllData();
      setNotification({
        type: 'success',
        message: 'Все данные удалены! Перезагрузите страницу.'
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <>
      {/* Кнопка для открытия менеджера данных */}
      <button
        onClick={() => setShowManager(true)}
        className={`fixed bottom-20 right-4 z-40 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isDarkTheme 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        title="Управление данными"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Модальное окно управления данными */}
      {showManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 ${
            isDarkTheme ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>
                Управление данными
              </h2>
              <button
                onClick={() => setShowManager(false)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkTheme 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Информация о хранилище */}
              <StorageInfo isDarkTheme={isDarkTheme} />

              {/* Экспорт данных */}
              <div className="p-4 rounded-xl border border-dashed border-gray-300">
                <h3 className={`font-semibold mb-2 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}>
                  📤 Экспорт данных
                </h3>
                <p className={`text-sm mb-3 ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Скачайте резервную копию всех ваших данных
                </p>
                <button
                  onClick={handleExport}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Экспортировать данные
                </button>
              </div>

              {/* Импорт данных */}
              <div className="p-4 rounded-xl border border-dashed border-gray-300">
                <h3 className={`font-semibold mb-2 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}>
                  📥 Импорт данных
                </h3>
                <p className={`text-sm mb-3 ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Восстановите данные из резервной копии
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                />
              </div>

              {/* Очистка данных */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                <h3 className={`font-semibold mb-2 ${
                  isDarkTheme ? 'text-white' : 'text-red-900'
                }`}>
                  🗑️ Очистка данных
                </h3>
                <p className={`text-sm mb-3 ${
                  isDarkTheme ? 'text-gray-400' : 'text-red-700'
                }`}>
                  Удалить все данные приложения
                </p>
                <button
                  onClick={handleClearData}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Удалить все данные
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className={`text-xs ${
                isDarkTheme ? 'text-gray-500' : 'text-gray-500'
              }`}>
                💡 Совет: Регулярно экспортируйте данные для создания резервных копий
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Уведомления */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-lg transition-all duration-300 ${
          notification.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {notification.type === 'error' ? '⚠️' : '✅'}
            </span>
            <span className="font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
