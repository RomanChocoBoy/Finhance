'use client';

import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { Achievement } from '../types';
import { useAnime } from '../hooks/useAnime';

interface AchievementsProps {
  achievements: Achievement[];
  isDarkTheme: boolean;
}

export default function Achievements({ achievements, isDarkTheme }: AchievementsProps) {
  const { ref, staggerChildren } = useAnime();

  useEffect(() => {
    // Анимация карточек достижений только при монтировании
    const timer = setTimeout(() => {
      staggerChildren('.achievement-card', 0, 150);
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Пустой массив зависимостей - анимация только при монтировании

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {achievements.map(achievement => (
        <div 
          key={achievement.id} 
          className={`achievement-card rounded-3xl p-8 shadow-lg transition-all ${
            achievement.unlocked 
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black' 
              : `${isDarkTheme ? 'bg-gray-900 text-gray-500' : 'bg-white text-gray-400'}`
          }`}
        >
          <div className="flex items-start gap-6">
            <div className={`text-5xl ${achievement.unlocked ? 'opacity-100' : 'opacity-30'}`}>
              {achievement.icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-xl mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{achievement.title}</h3>
              <p className={`text-sm ${achievement.unlocked ? 'opacity-100' : ''} ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                {achievement.description}
              </p>
              {achievement.unlocked && (
                <div className="flex items-center gap-2 mt-4">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Получено</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
