'use client';

import { Filter } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  isDarkTheme: boolean;
  filterCategory: string;
  onFilterChange: (category: string) => void;
}

const categories = ['Еда', 'Транспорт', 'Развлечения', 'Здоровье', 'Одежда', 'Образование', 'Другое', 'Зарплата'];

export default function Transactions({ transactions, isDarkTheme, filterCategory, onFilterChange }: TransactionsProps) {
  const filteredTransactions = filterCategory === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className={`rounded-3xl p-6 shadow-lg transition-colors ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex items-center gap-3 overflow-x-auto">
          <Filter className={`w-5 h-5 flex-shrink-0 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`} />
          <button
            onClick={() => onFilterChange('all')}
            className={`px-5 py-3 rounded-full whitespace-nowrap transition-colors ${
              filterCategory === 'all' ? 'bg-yellow-400 text-black font-medium' : `${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`
            }`}
          >
            Все
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onFilterChange(cat)}
              className={`px-5 py-3 rounded-full whitespace-nowrap transition-colors ${
                      filterCategory === cat ? 'bg-yellow-400 text-black font-medium' : `${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className={`rounded-3xl shadow-lg divide-y transition-colors ${isDarkTheme ? 'bg-gray-900 divide-gray-800' : 'bg-white'}`}>
        {filteredTransactions.map(transaction => (
          <div key={transaction.id} className={`p-6 flex items-center justify-between transition-colors ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-xl">{transaction.type === 'income' ? '↑' : '↓'}</span>
              </div>
              <div>
                <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{transaction.category}</p>
                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{transaction.description}</p>
                <p className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-500' : 'text-gray-500'}`}>{new Date(transaction.date).toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
            <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
