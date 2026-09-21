'use client';

import { useEffect } from 'react';
import { Goal } from '../types';
import { useAnime } from '../hooks/useAnime';

interface GoalsProps {
  goals: Goal[];
  isDarkTheme: boolean;
}

export default function Goals({ goals, isDarkTheme }: GoalsProps) {
  const { ref, staggerChildren } = useAnime();

  useEffect(() => {
    // Анимация карточек целей только при монтировании
    const timer = setTimeout(() => {
      staggerChildren('.goal-card', 0, 200);
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Пустой массив зависимостей - анимация только при монтировании

  return (
    <div ref={ref} className="space-y-6">
      {goals.map(goal => (
        <div key={goal.id} className={`goal-card rounded-3xl p-8 shadow-lg transition-colors ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white'}`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className={`font-bold text-xl ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{goal.title}</h3>
              <p className={`text-sm mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                {goal.type === 'save' ? 'Накопление' : 'Сокращение расходов'}
              </p>
            </div>
            <div className="text-right">
                <p className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{Math.round((goal.current / goal.target) * 100)}%</p>
              <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{goal.current.toLocaleString('ru-RU')} / {goal.target.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>
          <div className={`w-full rounded-full h-4 overflow-hidden ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
