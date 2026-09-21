'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import Navigation from './components/Navigation';
import AnimatedTabContent from './components/AnimatedTabContent';
import FloatingActionButton from './components/FloatingActionButton';
import AddGoalButton from './components/AddGoalButton';
import AddTransactionModal from './components/AddTransactionModal';
import AddGoalModal from './components/AddGoalModal';
import { Transaction, Goal, Achievement, NewTransaction, NewGoal } from './types';
import { useAppSettings, useAppData, useDataMigration, useAchievements } from './hooks/index';
import { useLocalStorageCleanup } from './hooks/useLocalStorageCleanup';
import { useTheme } from './hooks/useTheme';
import DebugInfo from './components/DebugInfo';

export default function FinHanceApp() {
  // Используем хук темы с предотвращением гидратации
  const { isDarkTheme, toggleTheme, isLoaded } = useTheme();
  
  // Используем хуки для работы с localStorage
  const { activeTab, setActiveTab, filterCategory, setFilterCategory } = useAppSettings();
  const { transactions, goals, achievements } = useAppData();
  
  // Очистка localStorage от некорректных данных
  useLocalStorageCleanup();
  
  // Миграция данных
  useDataMigration();
  
  // Автоматическое обновление достижений
  useAchievements(transactions.items, goals.items, achievements.items, achievements.setItems);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [notification, setNotification] = useState<{type: 'error' | 'success', message: string} | null>(null);
  
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    type: 'expense',
    amount: '',
    category: 'Еда',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [newGoal, setNewGoal] = useState<NewGoal>({
    title: '',
    target: '',
    current: 0,
    type: 'save'
  });

  // Функция для расчета текущего баланса
  const calculateBalance = () => {
    return transactions.items.reduce((balance: number, transaction: Transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  };

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) return;
    
    const amount = parseFloat(newTransaction.amount);
    const currentBalance = calculateBalance();
    
    // Проверяем, если это расход и сумма превышает баланс
    if (newTransaction.type === 'expense' && amount > currentBalance) {
      setNotification({
        type: 'error',
        message: `Недостаточно средств! Текущий баланс: ${currentBalance.toLocaleString('ru-RU')}₽`
      });
      
      // Автоматически скрываем уведомление через 5 секунд
      setTimeout(() => setNotification(null), 5000);
      return;
    }
    
    // Добавляем транзакцию через хук
    transactions.addItem({
      type: newTransaction.type,
      amount: amount,
      category: newTransaction.category,
      date: newTransaction.date,
      description: newTransaction.description
    });
    
    setShowAddModal(false);
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: 'Еда',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    
    // Показываем успешное уведомление
    setNotification({
      type: 'success',
      message: 'Операция успешно добавлена!'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    
    // Добавляем цель через хук
    goals.addItem({
      title: newGoal.title,
      target: parseFloat(newGoal.target),
      current: 0,
      type: newGoal.type
    });
    
    setShowGoalModal(false);
    setNewGoal({ title: '', target: '', current: 0, type: 'save' });
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (category: string) => {
    setFilterCategory(category);
  };

  const handleTransactionChange = (transaction: NewTransaction) => {
    setNewTransaction(transaction);
  };

  const handleGoalChange = (goal: NewGoal) => {
    setNewGoal(goal);
  };

  // Показываем загрузку до инициализации темы
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${isDarkTheme ? 'bg-black' : 'bg-gray-50'}`}>
      <Header isDarkTheme={isDarkTheme} onToggleTheme={handleToggleTheme} />
      <BalanceCard transactions={transactions.items} isDarkTheme={isDarkTheme} />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} isDarkTheme={isDarkTheme} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatedTabContent
          activeTab={activeTab}
          transactions={transactions.items}
          goals={goals.items}
          achievements={achievements.items}
          isDarkTheme={isDarkTheme}
          filterCategory={filterCategory}
          onFilterChange={handleFilterChange}
          onToggleTheme={handleToggleTheme}
        />
      </main>

      <FloatingActionButton onClick={() => setShowAddModal(true)} />

      {activeTab === 'goals' && (
        <AddGoalButton onClick={() => setShowGoalModal(true)} />
      )}

      <DebugInfo achievements={achievements.items} isDarkTheme={isDarkTheme} />

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newTransaction={newTransaction}
        onTransactionChange={handleTransactionChange}
        onAddTransaction={addTransaction}
        isDarkTheme={isDarkTheme}
      />

      <AddGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        newGoal={newGoal}
        onGoalChange={handleGoalChange}
        onAddGoal={addGoal}
        isDarkTheme={isDarkTheme}
      />

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
