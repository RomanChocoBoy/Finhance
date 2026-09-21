'use client';

import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAnime } from '../hooks/useAnime';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const { ref, scaleIn, pulse } = useAnime();

  useEffect(() => {
    // Анимация появления кнопки только при монтировании
    const timer = setTimeout(() => {
      scaleIn(500, 600);
    }, 100);
    
    // Периодическая пульсация
    const interval = setInterval(() => {
      pulse(0);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []); // Пустой массив зависимостей - анимация только при монтировании

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="fixed bottom-8 right-8 w-18 h-18 bg-black text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
    >
      <Plus className="w-8 h-8" />
    </button>
  );
}
