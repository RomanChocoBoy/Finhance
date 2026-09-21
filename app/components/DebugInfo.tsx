'use client';

interface DebugInfoProps {
  achievements: any[];
  isDarkTheme: boolean;
}

export default function DebugInfo({ achievements, isDarkTheme }: DebugInfoProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 p-4 rounded-lg text-xs ${
      isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <h3 className="font-bold mb-2">Debug Info:</h3>
      <div>Достижений: {achievements?.length || 0}</div>
      <div>Тема: {isDarkTheme ? 'Темная' : 'Светлая'}</div>
      <div>localStorage: {typeof window !== 'undefined' ? localStorage.getItem('finhance-achievements')?.length || 0 : 'N/A'}</div>
    </div>
  );
}
