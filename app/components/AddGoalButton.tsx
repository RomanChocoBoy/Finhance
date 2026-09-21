'use client';

interface AddGoalButtonProps {
  onClick: () => void;
}

export default function AddGoalButton({ onClick }: AddGoalButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-28 right-8 bg-yellow-400 text-black px-8 py-4 rounded-2xl shadow-lg font-medium hover:scale-105 transition-transform z-40"
    >
      + Новая цель
    </button>
  );
}
