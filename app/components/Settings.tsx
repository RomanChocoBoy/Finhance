'use client';

import { useState } from 'react';
import { useDataExport } from '../hooks/useLocalStorage';
import StorageInfo from './StorageInfo';

interface SettingsProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export default function Settings({ isDarkTheme, onToggleTheme }: SettingsProps) {
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
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>
          ⚙️ Настройки
        </h2>
        <p className={`text-sm ${
          isDarkTheme ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Управление приложением и данными
        </p>
      </div>

      {/* Внешний вид */}
      <div className={`p-6 rounded-2xl border ${
        isDarkTheme 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>
          🎨 Внешний вид
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              Темная тема
            </p>
            <p className={`text-sm ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Переключить между светлой и темной темой
            </p>
          </div>
          <button
            onClick={onToggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkTheme ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkTheme ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Информация о хранилище */}
      <StorageInfo isDarkTheme={isDarkTheme} />

      {/* Управление данными */}
      <div className={`p-6 rounded-2xl border ${
        isDarkTheme 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>
          💾 Управление данными
        </h3>
        
        <div className="space-y-4">
          {/* Экспорт данных */}
          <div className="p-4 rounded-xl border border-dashed border-gray-300">
            <h4 className={`font-semibold mb-2 ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              📤 Экспорт данных
            </h4>
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
            <h4 className={`font-semibold mb-2 ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              📥 Импорт данных
            </h4>
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
            <h4 className={`font-semibold mb-2 ${
              isDarkTheme ? 'text-white' : 'text-red-900'
            }`}>
              🗑️ Очистка данных
            </h4>
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
      </div>

      {/* Информация о приложении */}
      <div className={`p-6 rounded-2xl border ${
        isDarkTheme 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>
          ℹ️ О приложении
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`text-sm ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Версия:
            </span>
            <span className={`text-sm font-medium ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              0.0.1
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Разработчик:
            </span>
            <span className={`text-sm font-medium ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              MeowTeam
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Лицензия:
            </span>
            <span className={`text-sm font-medium ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              MeowTeam
            </span>
          </div>
        </div>
      </div>

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
    </div>
  );
}
