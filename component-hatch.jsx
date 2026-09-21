import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, Target, Award, Filter, X, Check, ChevronDown, Moon, Sun } from 'lucide-react';

export default function FinHanceApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 500, category: 'Еда', date: '2025-10-10', description: 'Продукты' },
    { id: 2, type: 'income', amount: 50000, category: 'Зарплата', date: '2025-10-05', description: 'Месячная зарплата' },
    { id: 3, type: 'expense', amount: 1200, category: 'Транспорт', date: '2025-10-08', description: 'Проездной' },
    { id: 4, type: 'expense', amount: 800, category: 'Развлечения', date: '2025-10-12', description: 'Кино' },
  ]);
  const [goals, setGoals] = useState([
    { id: 1, title: 'Накопить на отпуск', target: 100000, current: 25000, type: 'save' },
    { id: 2, title: 'Снизить расходы на еду', target: 15000, current: 12000, type: 'reduce' },
    { id: 3, title: 'Отложить на подушку безопасности', target: 200000, current: 80000, type: 'save' },
  ]);
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Первая запись', description: 'Добавлена первая транзакция', unlocked: true, icon: '🎯' },
    { id: 2, title: 'Экономный', description: 'Сэкономлено 10000₽', unlocked: true, icon: '💰' },
    { id: 3, title: 'Без перерасхода', description: 'Месяц без перерасхода бюджета', unlocked: false, icon: '📊' },
    { id: 4, title: 'Целеустремленный', description: 'Выполнена первая цель', unlocked: false, icon: '🏆' },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: 'Еда',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    current: 0,
    type: 'save'
  });

  const categories = ['Еда', 'Транспорт', 'Развлечения', 'Здоровье', 'Одежда', 'Образование', 'Другое', 'Зарплата'];

  const calculateBalance = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return income - expenses;
  };

  const getCategoryData = () => {
    const expensesByCategory = {};
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

  const COLORS = ['#FFD93D', '#6BCF7F', '#4ECBFC', '#A67FFF', '#FF6B6B', '#FFA06B', '#95E1D3'];

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) return;
    
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    };
    
    setTransactions([transaction, ...transactions]);
    setShowAddModal(false);
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: 'Еда',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      target: parseFloat(newGoal.target),
      current: 0
    };
    
    setGoals([...goals, goal]);
    setShowGoalModal(false);
    setNewGoal({ title: '', target: '', current: 0, type: 'save' });
  };

  const filteredTransactions = filterCategory === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === filterCategory);

  return (
    <div className={`min-h-screen transition-colors ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">FinHance</h1>
              <p className="text-sm text-gray-400 mt-1">Умное управление финансами</p>
            </div>
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="p-3 hover:bg-gray-800 rounded-full transition-colors"
            >
              {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-sm opacity-80 mb-2">Текущий баланс</p>
          <p className="text-5xl font-bold">{calculateBalance().toLocaleString('ru-RU')} ₽</p>
          <div className="flex gap-4 mt-6">
            <div>
              <p className="text-xs opacity-80">Доходы</p>
              <p className="text-xl font-semibold">
                +{transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div>
              <p className="text-xs opacity-80">Расходы</p>
              <p className="text-xl font-semibold">
                -{transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`border-b sticky top-16 z-40 transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Обзор', icon: TrendingUp },
              { id: 'transactions', label: 'Операции', icon: Filter },
              { id: 'goals', label: 'Цели', icon: Target },
              { id: 'achievements', label: 'Достижения', icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? `${isDarkTheme ? 'text-white' : 'text-black'} border-b-2 border-yellow-400` 
                    : `${isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className={`rounded-2xl p-6 shadow-sm transition-colors ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                <h3 className="text-lg font-bold mb-4">Расходы по категориям</h3>
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
              <div className={`rounded-2xl p-6 shadow-sm transition-colors ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                <h3 className="text-lg font-bold mb-4">Динамика расходов</h3>
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
            <div className={`rounded-2xl p-6 shadow-sm transition-colors ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white'}`}>
              <h3 className="text-lg font-bold mb-4">Последние операции</h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className={`flex items-center justify-between py-3 border-b last:border-b-0 ${isDarkTheme ? 'border-gray-700' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <span className="text-lg">{transaction.type === 'income' ? '↑' : '↓'}</span>
                      </div>
                      <div>
                        <p className="font-medium">{transaction.category}</p>
                        <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('ru-RU')} ₽
                      </p>
                      <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(transaction.date).toLocaleDateString('ru-RU')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className={`rounded-2xl p-4 shadow-sm transition-colors ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-2 overflow-x-auto">
                <Filter className={`w-5 h-5 flex-shrink-0 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`} />
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    filterCategory === 'all' ? 'bg-yellow-400 text-black font-medium' : `${isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                  }`}
                >
                  Все
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      filterCategory === cat ? 'bg-yellow-400 text-black font-medium' : `${isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions List */}
            <div className={`rounded-2xl shadow-sm divide-y transition-colors ${isDarkTheme ? 'bg-gray-800 divide-gray-700' : 'bg-white'}`}>
              {filteredTransactions.map(transaction => (
                <div key={transaction.id} className={`p-4 flex items-center justify-between transition-colors ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className="text-xl">{transaction.type === 'income' ? '↑' : '↓'}</span>
                    </div>
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.description}</p>
                      <p className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(transaction.date).toLocaleDateString('ru-RU')}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.id} className={`rounded-2xl p-6 shadow-sm transition-colors ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    <p className={`text-sm mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                      {goal.type === 'save' ? 'Накопление' : 'Сокращение расходов'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{Math.round((goal.current / goal.target) * 100)}%</p>
                    <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{goal.current.toLocaleString('ru-RU')} / {goal.target.toLocaleString('ru-RU')} ₽</p>
                  </div>
                </div>
                <div className={`w-full rounded-full h-3 overflow-hidden ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`rounded-2xl p-6 shadow-sm transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black' 
                    : `${isDarkTheme ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400'}`
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-5xl ${achievement.unlocked ? 'opacity-100' : 'opacity-30'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                    <p className={`text-sm ${achievement.unlocked ? 'opacity-90' : ''}`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked && (
                      <div className="flex items-center gap-1 mt-3">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Получено</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-4">
          <div className={`rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-screen overflow-y-auto transition-colors ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Новая операция</h2>
                <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                      newTransaction.type === 'expense' ? 'bg-red-500 text-white' : `${isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                    }`}
                  >
                    Расход
                  </button>
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                      newTransaction.type === 'income' ? 'bg-green-500 text-white' : `${isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                    }`}
                  >
                    Доход
                  </button>
                </div>

                {/* Amount */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Сумма</label>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-yellow-400 focus:outline-none text-lg transition-colors ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                    placeholder="0"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Категория</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Дата</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Описание</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                    placeholder="Например, покупка продуктов"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={addTransaction}
                  className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  Добавить операцию
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Button */}
      {activeTab === 'goals' && (
        <button
          onClick={() => setShowGoalModal(true)}
          className="fixed bottom-24 right-6 bg-yellow-400 text-black px-6 py-3 rounded-full shadow-lg font-medium hover:scale-105 transition-transform z-40"
        >
          + Новая цель
        </button>
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-4">
          <div className={`rounded-t-3xl md:rounded-3xl w-full md:max-w-md transition-colors ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Новая цель</h2>
                <button onClick={() => setShowGoalModal(false)} className={`p-2 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Название цели</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                    placeholder="Например, накопить на отпуск"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Целевая сумма</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Тип цели</label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  >
                    <option value="save">Накопить сумму</option>
                    <option value="reduce">Снизить расходы</option>
                  </select>
                </div>

                <button
                  onClick={addGoal}
                  className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  Создать цель
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}