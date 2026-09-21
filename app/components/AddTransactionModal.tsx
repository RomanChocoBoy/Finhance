'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { NewTransaction } from '../types';
import { useAnime } from '../hooks/useAnime';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTransaction: NewTransaction;
  onTransactionChange: (transaction: NewTransaction) => void;
  onAddTransaction: () => void;
  isDarkTheme: boolean;
}

const categories = ['Еда', 'Транспорт', 'Развлечения', 'Здоровье', 'Одежда', 'Образование', 'Другое', 'Зарплата'];

export default function AddTransactionModal({
  isOpen, 
  onClose, 
  newTransaction, 
  onTransactionChange, 
  onAddTransaction, 
  isDarkTheme 
}: AddTransactionModalProps) {
  const { ref, modalIn, modalOut } = useAnime();

  useEffect(() => {
    if (isOpen) {
      // Анимация появления модального окна
      modalIn(100);
    }
  }, [isOpen, modalIn]);

  const handleClose = () => {
    modalOut(() => {
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
      <div ref={ref} className={`rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-screen overflow-y-auto transition-colors ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Новая операция</h2>
            <button onClick={handleClose} className={`p-2 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Type Toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => onTransactionChange({...newTransaction, type: 'expense'})}
                className={`flex-1 py-4 rounded-2xl font-medium transition-colors ${
                  newTransaction.type === 'expense' ? 'bg-red-500 text-white' : `${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                }`}
              >
                Расход
              </button>
              <button
                onClick={() => onTransactionChange({...newTransaction, type: 'income'})}
                className={`flex-1 py-4 rounded-2xl font-medium transition-colors ${
                  newTransaction.type === 'income' ? 'bg-green-500 text-white' : `${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                }`}
              >
                Доход
              </button>
            </div>

            {/* Amount */}
            <div>
                  <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Сумма</label>
              <input
                type="number"
                value={newTransaction.amount}
                onChange={(e) => onTransactionChange({...newTransaction, amount: e.target.value})}
                className={`w-full px-5 py-4 border-2 rounded-2xl focus:border-yellow-400 focus:outline-none text-lg transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                placeholder="0"
              />
            </div>

            {/* Category */}
            <div>
                  <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Категория</label>
              <select
                value={newTransaction.category}
                onChange={(e) => onTransactionChange({...newTransaction, category: e.target.value})}
                className={`w-full px-5 py-4 border-2 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className={isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
                  <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Дата</label>
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => onTransactionChange({...newTransaction, date: e.target.value})}
                className={`w-full px-5 py-4 border-2 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
              />
            </div>

            {/* Description */}
            <div>
                  <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Описание</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => onTransactionChange({...newTransaction, description: e.target.value})}
                className={`w-full px-5 py-4 border-2 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                placeholder="Например, покупка продуктов"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={onAddTransaction}
              className="w-full bg-black text-white py-5 rounded-2xl font-medium hover:bg-gray-800 transition-colors"
            >
              Добавить операцию
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
