
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExpenseChartProps {
  data: {
    name: string;
    amount: number;
  }[];
}

const ExpenseChart = ({ data }: ExpenseChartProps) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[300px] animate-pulse flex items-center justify-center bg-gray-50 rounded-lg">
        <span className="text-gray-400">Loading chart...</span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5 h-[350px]">
      <h3 className="text-lg font-medium mb-4">Monthly Spending</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: isMobile ? 0 : 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            width={isMobile ? 35 : 50}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "8px 12px",
            }}
            formatter={(value) => [`$${value}`, "Amount"]}
            cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
          />
          <Bar
            dataKey="amount"
            fill="rgba(59, 130, 246, 0.8)"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
