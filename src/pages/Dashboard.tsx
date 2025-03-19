
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend,
} from "recharts";
import { ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ExpenseCard from "@/components/ExpenseCard";
import ExpenseChart from "@/components/ExpenseChart";
import { useAuth } from "@/contexts/AuthContext";
import { mockExpenses, mockCategories, mockMonthlySpending } from "@/data/mockExpenses";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate total expenses
  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const renderPieChart = () => {
    if (!mounted) return (
      <div className="w-full h-[250px] animate-pulse flex items-center justify-center bg-gray-50 rounded-lg">
        <span className="text-gray-400">Loading chart...</span>
      </div>
    );
    
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={mockCategories}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={isMobile ? 55 : 70}
            outerRadius={isMobile ? 80 : 100}
            paddingAngle={2}
            dataKey="amount"
            animationDuration={1000}
          >
            {mockCategories.map((category) => (
              <Cell key={category.id} fill={category.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`$${value}`, "Amount"]}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "8px 12px",
            }}
          />
          <Legend 
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry, index) => {
              return <span style={{ color: '#333' }}>{value}</span>;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="text-gray-500 mt-2">
            Here's an overview of your expenses
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6 animate-slide-in">
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
            <h3 className="text-2xl font-bold mt-2">${totalExpenses.toFixed(2)}</h3>
            <p className="text-sm text-gray-500 mt-1">Current Month</p>
          </div>
          
          <div className="glass-card rounded-xl p-6 animate-slide-in" style={{ animationDelay: "100ms" }}>
            <p className="text-sm font-medium text-gray-500">Average Per Day</p>
            <h3 className="text-2xl font-bold mt-2">${(totalExpenses / 30).toFixed(2)}</h3>
            <p className="text-sm text-gray-500 mt-1">30 Day Period</p>
          </div>
          
          <div className="glass-card rounded-xl p-6 animate-slide-in" style={{ animationDelay: "200ms" }}>
            <p className="text-sm font-medium text-gray-500">Top Category</p>
            <h3 className="text-2xl font-bold mt-2">Technology</h3>
            <p className="text-sm text-gray-500 mt-1">$1,250.00 spent</p>
          </div>
        </div>
        
        {/* Charts & Recent Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-8 space-y-6">
            {/* Monthly Chart */}
            <ExpenseChart data={mockMonthlySpending} />
            
            {/* Category Breakdown */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
              {renderPieChart()}
            </div>
          </div>
          
          {/* Right Column - Recent Expenses & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Expenses</h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="#" className="text-sm flex items-center">
                    View all
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockExpenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium">{expense.merchant}</p>
                      <p className="text-sm text-gray-500">{expense.date}</p>
                    </div>
                    <span className="font-medium">${expense.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link to="/upload" className="flex items-center justify-center">
                    <PlusCircle size={18} className="mr-2" />
                    Add New Expense
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
