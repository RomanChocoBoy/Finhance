export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  type: 'save' | 'reduce';
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface NewTransaction {
  type: 'income' | 'expense';
  amount: string;
  category: string;
  date: string;
  description: string;
}

export interface NewGoal {
  title: string;
  target: string;
  current: number;
  type: 'save' | 'reduce';
}
