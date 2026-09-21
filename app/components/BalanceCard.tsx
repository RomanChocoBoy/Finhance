'use client';

import { Transaction } from '../types';

interface BalanceCardProps {
  transactions: Transaction[];
  isDarkTheme: boolean;
}

export default function BalanceCard({ transactions, isDarkTheme }: BalanceCardProps) {
  const calculateBalance = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return income - expenses;
  };

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-sm opacity-80 mb-2">Текущий баланс</p>
        <p className="text-5xl font-bold">{calculateBalance().toLocaleString('ru-RU')} ₽</p>
        <div className="flex gap-4 mt-6">
          <div>
            <p className="text-xs opacity-80">Доходы</p>
            <p className="text-xl font-semibold">
              +{income.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div>
            <p className="text-xs opacity-80">Расходы</p>
            <p className="text-xl font-semibold">
              -{expenses.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
