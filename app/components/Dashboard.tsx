'use client';

import { useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';
import { useAnime } from '../hooks/useAnime';

interface DashboardProps {
  transactions: Transaction[];
  isDarkTheme: boolean;
}

const COLORS = ['#FFD93D', '#6BCF7F', '#4ECBFC', '#A67FFF', '#FF6B6B', '#FFA06B', '#95E1D3'];

export default function Dashboard({ transactions, isDarkTheme }: DashboardProps) {
  const { ref, fadeInUp, staggerChildren, chartAnimation } = useAnime();

  useEffect(() => {
    // Анимация появления дашборда только при первом рендере
    const timer = setTimeout(() => {
      fadeInUp(0, 800);
      
      // Анимация карточек с задержкой
      setTimeout(() => {
        staggerChildren('.dashboard-card', 0, 150);
      }, 200);
      
      // Анимация графиков
      setTimeout(() => {
        chartAnimation(0);
      }, 400);
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Пустой массив зависимостей - анимация только при монтировании

  const getCategoryData = () => {
    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });
    
    return Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  };

  const getTimelineData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExpenses = transactions
        .filter(t => t.type === 'expense' && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      
      last7Days.push({
        date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        amount: dayExpenses
      });
    }
    return last7Days;
  };

  return (
    <div ref={ref} className="space-y-8">
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className={`dashboard-card rounded-3xl p-8 shadow-lg transition-colors ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white'}`}>
          <h3 className={`text-xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Расходы по категориям</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getCategoryData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className={`dashboard-card rounded-3xl p-8 shadow-lg transition-colors ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white'}`}>
          <h3 className={`text-xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Динамика расходов</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getTimelineData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`} />
              <Line type="monotone" dataKey="amount" stroke="#FFD93D" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={`dashboard-card rounded-3xl p-8 shadow-lg transition-colors ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Последние операции</h3>
        <div className="space-y-4">
          {transactions.slice(0, 5).map(transaction => (
            <div key={transaction.id} className={`flex items-center justify-between py-4 border-b last:border-b-0 ${isDarkTheme ? 'border-gray-800' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className="text-lg">{transaction.type === 'income' ? '↑' : '↓'}</span>
                </div>
                <div>
                  <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{transaction.category}</p>
                  <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{transaction.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('ru-RU')} ₽
                </p>
                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(transaction.date).toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
