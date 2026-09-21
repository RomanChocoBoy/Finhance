import { useEffect } from 'react';
import { Transaction, Goal, Achievement } from '../types';

/**
 * Хук для автоматического обновления достижений
 * Проверяет условия и разблокирует достижения
 */
export function useAchievements(
  transactions: Transaction[],
  goals: Goal[],
  achievements: Achievement[],
  setAchievements: (achievements: Achievement[]) => void
) {
  useEffect(() => {
    // Не выполняем проверку, если данные еще не загружены
    if (!achievements || achievements.length === 0) {
      return;
    }

    const checkAchievements = () => {
      const updatedAchievements = [...achievements];
      let hasChanges = false;

      // 1. Первая запись
      if (transactions.length >= 1 && updatedAchievements[0] && !updatedAchievements[0].unlocked) {
        updatedAchievements[0].unlocked = true;
        hasChanges = true;
      }

      // 2. Экономный (сэкономлено 10000₽)
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const saved = totalIncome - totalExpenses;
      
      if (saved >= 10000 && updatedAchievements[1] && !updatedAchievements[1].unlocked) {
        updatedAchievements[1].unlocked = true;
        hasChanges = true;
      }

      // 3. Без перерасхода (месяц без перерасхода)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      });
      
      const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const monthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (monthlyIncome >= monthlyExpenses && monthlyTransactions.length > 0 && updatedAchievements[2] && !updatedAchievements[2].unlocked) {
        updatedAchievements[2].unlocked = true;
        hasChanges = true;
      }

      // 4. Целеустремленный (выполнена первая цель)
      const completedGoals = goals.filter(g => g.current >= g.target);
      if (completedGoals.length >= 1 && updatedAchievements[3] && !updatedAchievements[3].unlocked) {
        updatedAchievements[3].unlocked = true;
        hasChanges = true;
      }

      // 5. Финансовый Дневник (100 транзакций)
      if (transactions.length >= 100 && updatedAchievements[4] && !updatedAchievements[4].unlocked) {
        updatedAchievements[4].unlocked = true;
        hasChanges = true;
      }

      // 6. Мастер Бюджета (3 месяца без перерасхода)
      // Упрощенная проверка - если текущий месяц без перерасхода
      if (monthlyIncome >= monthlyExpenses && monthlyTransactions.length > 0 && updatedAchievements[5] && !updatedAchievements[5].unlocked) {
        updatedAchievements[5].unlocked = true;
        hasChanges = true;
      }

      // 7. Копилка (сэкономлено 50000₽)
      if (saved >= 50000 && updatedAchievements[6] && !updatedAchievements[6].unlocked) {
        updatedAchievements[6].unlocked = true;
        hasChanges = true;
      }

      // 8. Покоритель Вершин (5 выполненных целей)
      if (completedGoals.length >= 5 && updatedAchievements[7] && !updatedAchievements[7].unlocked) {
        updatedAchievements[7].unlocked = true;
        hasChanges = true;
      }

      // 9. Денежный Поток (25 операций дохода)
      const incomeTransactions = transactions.filter(t => t.type === 'income');
      if (incomeTransactions.length >= 25 && updatedAchievements[8] && !updatedAchievements[8].unlocked) {
        updatedAchievements[8].unlocked = true;
        hasChanges = true;
      }

      // 10. Разумный Потребитель (5 месяцев доходы > расходы)
      // Упрощенная проверка - если общие доходы больше расходов
      if (totalIncome > totalExpenses && transactions.length > 0 && updatedAchievements[9] && !updatedAchievements[9].unlocked) {
        updatedAchievements[9].unlocked = true;
        hasChanges = true;
      }

      // 11. Финансовый Гуру (баланс достиг 100000₽)
      if (saved >= 100000 && updatedAchievements[10] && !updatedAchievements[10].unlocked) {
        updatedAchievements[10].unlocked = true;
        hasChanges = true;
      }

      // 12. Планировщик (создано 10 целей)
      if (goals.length >= 10 && updatedAchievements[11] && !updatedAchievements[11].unlocked) {
        updatedAchievements[11].unlocked = true;
        hasChanges = true;
      }

      // 13. Без Долгов (3 месяца без отрицательного баланса)
      // Упрощенная проверка - если текущий баланс положительный
      if (saved >= 0 && transactions.length > 0 && updatedAchievements[12] && !updatedAchievements[12].unlocked) {
        updatedAchievements[12].unlocked = true;
        hasChanges = true;
      }

      // 14. Ежедневный Учет (7 транзакций за 7 дней)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const weekTransactions = transactions.filter(t => 
        new Date(t.date) >= lastWeek
      );
      if (weekTransactions.length >= 7 && updatedAchievements[13] && !updatedAchievements[13].unlocked) {
        updatedAchievements[13].unlocked = true;
        hasChanges = true;
      }

      if (hasChanges) {
        setAchievements(updatedAchievements);
      }
    };

    checkAchievements();
  }, [transactions, goals, achievements, setAchievements]);
}
