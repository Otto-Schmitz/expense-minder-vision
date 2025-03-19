
export interface Expense {
  id: string;
  amount: number;
  date: string;
  merchant: string;
  category: string;
  tags?: string[];
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  amount: number;
  color: string;
}
