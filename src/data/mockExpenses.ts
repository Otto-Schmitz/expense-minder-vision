
import { Expense, Category } from "@/types/expense";

export const mockExpenses: Expense[] = [
  {
    id: "exp_1",
    amount: 42.50,
    date: "2023-05-15",
    merchant: "Starbucks",
    category: "Food & Dining",
    tags: ["coffee", "business"]
  },
  {
    id: "exp_2",
    amount: 1250.00,
    date: "2023-05-10",
    merchant: "Apple Store",
    category: "Technology",
    tags: ["electronics", "work"]
  },
  {
    id: "exp_3",
    amount: 85.20,
    date: "2023-05-08",
    merchant: "Amazon",
    category: "Shopping",
    tags: ["books", "personal"]
  },
  {
    id: "exp_4",
    amount: 350.00,
    date: "2023-05-05",
    merchant: "United Airlines",
    category: "Travel",
    tags: ["flight", "business"]
  },
  {
    id: "exp_5",
    amount: 120.75,
    date: "2023-05-03",
    merchant: "Trader Joe's",
    category: "Groceries",
    tags: ["food", "household"]
  },
  {
    id: "exp_6",
    amount: 65.30,
    date: "2023-04-29",
    merchant: "Gas Station",
    category: "Transportation",
    tags: ["fuel", "car"]
  },
  {
    id: "exp_7",
    amount: 200.00,
    date: "2023-04-25",
    merchant: "Electricity Company",
    category: "Utilities",
    tags: ["monthly", "bills"]
  }
];

export const mockCategories: Category[] = [
  {
    id: "cat_1",
    name: "Food & Dining",
    amount: 250.75,
    color: "#3B82F6" // blue
  },
  {
    id: "cat_2",
    name: "Technology",
    amount: 1250.00,
    color: "#10B981" // green
  },
  {
    id: "cat_3",
    name: "Shopping",
    amount: 385.20,
    color: "#F59E0B" // amber
  },
  {
    id: "cat_4",
    name: "Travel",
    amount: 520.00,
    color: "#8B5CF6" // purple
  },
  {
    id: "cat_5",
    name: "Groceries",
    amount: 320.75,
    color: "#EC4899" // pink
  },
  {
    id: "cat_6",
    name: "Transportation",
    amount: 165.30,
    color: "#EF4444" // red
  },
  {
    id: "cat_7",
    name: "Utilities",
    amount: 275.00,
    color: "#6B7280" // gray
  }
];

export const mockMonthlySpending = [
  { name: "Jan", amount: 1200 },
  { name: "Feb", amount: 1800 },
  { name: "Mar", amount: 1500 },
  { name: "Apr", amount: 2200 },
  { name: "May", amount: 1900 },
  { name: "Jun", amount: 2400 }
];

// Mock function to simulate AI processing
export const mockProcessInvoice = (file: File): Promise<Expense> => {
  // Simulate processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random expense based on the filename
      const randomAmount = Math.floor(Math.random() * 200) + 50;
      const today = new Date().toISOString().split('T')[0];
      
      const newExpense: Expense = {
        id: `exp_${Math.random().toString(36).substr(2, 9)}`,
        amount: randomAmount,
        date: today,
        merchant: "Auto-detected Merchant",
        category: "Uncategorized",
        tags: ["receipt", "uploaded"]
      };
      
      resolve(newExpense);
    }, 2000); // 2 second delay
  });
};
