'use client';

import { useEffect, useState } from 'react';
import { useAnime } from '../hooks/useAnime';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Goals from './Goals';
import Achievements from './Achievements';
import Settings from './Settings';
import { Transaction, Goal, Achievement } from '../types';

interface AnimatedTabContentProps {
  activeTab: string;
  transactions: Transaction[];
  goals: Goal[];
  achievements: Achievement[];
  isDarkTheme: boolean;
  filterCategory: string;
  onFilterChange: (category: string) => void;
  onToggleTheme: () => void;
}

export default function AnimatedTabContent({
  activeTab,
  transactions,
  goals,
  achievements,
  isDarkTheme,
  filterCategory,
  onFilterChange,
  onToggleTheme
}: AnimatedTabContentProps) {
  const [previousTab, setPreviousTab] = useState(activeTab);
  const [isAnimating, setIsAnimating] = useState(false);
  const { ref, tabTransition } = useAnime();

  useEffect(() => {
    if (previousTab !== activeTab) {
      setIsAnimating(true);
      
      // Определяем направление анимации
      const tabOrder = ['dashboard', 'transactions', 'goals', 'achievements'];
      const currentIndex = tabOrder.indexOf(activeTab);
      const previousIndex = tabOrder.indexOf(previousTab);
      const direction = currentIndex > previousIndex ? 'right' : 'left';
      
      // Анимация перехода
      setTimeout(() => {
        tabTransition(direction, 0);
        setIsAnimating(false);
        setPreviousTab(activeTab);
      }, 50);
    }
  }, [activeTab, previousTab, tabTransition]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} isDarkTheme={isDarkTheme} />;
      case 'transactions':
        return (
          <Transactions 
            transactions={transactions} 
            isDarkTheme={isDarkTheme} 
            filterCategory={filterCategory}
            onFilterChange={onFilterChange}
          />
        );
      case 'goals':
        return <Goals goals={goals} isDarkTheme={isDarkTheme} />;
      case 'achievements':
        return <Achievements achievements={achievements} isDarkTheme={isDarkTheme} />;
      case 'settings':
        return <Settings isDarkTheme={isDarkTheme} onToggleTheme={onToggleTheme} />;
      default:
        return null;
    }
  };

  return (
    <div ref={ref} className="relative">
      {renderContent()}
    </div>
  );
}
