
import { Banknote, Calendar, Tag } from "lucide-react";
import { Expense } from "@/types/expense";

interface ExpenseCardProps {
  expense: Expense;
}

const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  return (
    <div className="glass-card rounded-xl p-5 hover:shadow-md transition-all animate-slide-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-medium text-primary/80 chip-text">
            {expense.category}
          </p>
          <h3 className="font-medium text-lg mt-1">{expense.merchant}</h3>
        </div>
        <span className="text-lg font-semibold">
          ${expense.amount.toFixed(2)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{expense.date}</span>
        </div>
        {expense.tags && expense.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {expense.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex bg-gray-100 text-xs px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;
