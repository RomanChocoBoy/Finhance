'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { NewGoal } from '../types';
import { useAnime } from '../hooks/useAnime';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  newGoal: NewGoal;
  onGoalChange: (goal: NewGoal) => void;
  onAddGoal: () => void;
  isDarkTheme: boolean;
}

export default function AddGoalModal({
  isOpen, 
  onClose, 
  newGoal, 
  onGoalChange, 
  onAddGoal, 
  isDarkTheme 
}: AddGoalModalProps) {
  const { ref, modalIn, modalOut } = useAnime();

  useEffect(() => {
    if (isOpen) {
      modalIn(100);
    }
  }, [isOpen, modalIn]);

  const handleClose = () => {
    modalOut(() => {
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
      <div ref={ref} className={`rounded-t-3xl md:rounded-3xl w-full md:max-w-lg transition-colors ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Новая цель</h2>
            <button onClick={handleClose} className={`p-2 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Название цели</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => onGoalChange({...newGoal, title: e.target.value})}
                className={`w-full px-5 py-4 border-2 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                placeholder="Например, накопить на отпуск"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Целевая сумма</label>
              <input
                type="number"
                value={newGoal.target}
                onChange={(e) => onGoalChange({...newGoal, target: e.target.value})}
                className={`w-full px-5 py-4 border-2 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                placeholder="0"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Тип цели</label>
              <select
                value={newGoal.type}
                onChange={(e) => onGoalChange({...newGoal, type: e.target.value as 'save' | 'reduce'})}
                className={`w-full px-5 py-4 border-2 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
              >
                <option value="save" className={isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>Накопить сумму</option>
                <option value="reduce" className={isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>Снизить расходы</option>
              </select>
            </div>

            <button
              onClick={onAddGoal}
              className="w-full bg-black text-white py-5 rounded-2xl font-medium hover:bg-gray-800 transition-colors"
            >
              Создать цель
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
