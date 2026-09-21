'use client';

import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export default function Header({ isDarkTheme, onToggleTheme }: HeaderProps) {
  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">FinHance</h1>
            <p className="text-sm text-gray-400 mt-1">Умное управление финансами</p>
          </div>
            <button
              onClick={onToggleTheme}
              className="p-4 hover:bg-gray-800 rounded-2xl transition-colors"
            >
            {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
