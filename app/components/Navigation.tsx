'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Filter, Target, Award, Settings } from 'lucide-react';
import { useAnime } from '../hooks/useAnime';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkTheme: boolean;
}

export default function Navigation({ activeTab, onTabChange, isDarkTheme }: NavigationProps) {
  const { ref, fadeInUp } = useAnime();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Анимация появления навигации только при монтировании
    const timer = setTimeout(() => {
      fadeInUp(0, 600);
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Пустой массив зависимостей - анимация только при монтировании

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Всегда показываем навигацию в верхней части
      if (currentScrollY < 50) {
        setIsVisible(true);
      } 
      // Скрываем только при значительной прокрутке вниз
      else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } 
      // Показываем при любой прокрутке вверх
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const tabs = [
    { id: 'dashboard', label: 'Обзор', icon: TrendingUp },
    { id: 'transactions', label: 'Операции', icon: Filter },
    { id: 'goals', label: 'Цели', icon: Target },
    { id: 'achievements', label: 'Достижения', icon: Award },
    { id: 'settings', label: 'Настройки', icon: Settings }
  ];

  return (
    <div 
      ref={ref} 
      className={`border-b sticky top-16 z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isDarkTheme ? 'bg-black border-gray-800' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 font-medium whitespace-nowrap transition-colors rounded-xl ${
                  activeTab === tab.id 
                    ? `${isDarkTheme ? 'text-white bg-gray-900' : 'text-black bg-yellow-100'}` 
                    : `${isDarkTheme ? 'text-gray-400 hover:text-white hover:bg-gray-900' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`
                }`}
              >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
