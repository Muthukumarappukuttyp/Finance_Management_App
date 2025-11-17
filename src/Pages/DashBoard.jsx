import { ArrowUpCircle, ArrowDownCircle, Wallet, PiggyBank } from "lucide-react";
import { useTheme } from "../utilities/useTheme.js";
import useData from "../utilities/useData.jsx";
import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const Dashboard = () => {
  const { darkMode } = useTheme();
  const { income, expenses, savings, loading } = useData();
  const [showAll, setShowAll] = useState(false);

  // ----------------- Prepare chart data (monthly) -----------------
  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return months.map(month => {
      const incomeSum = income
        .filter(i => new Date(i.date).getMonth() === month)
        .reduce((sum, i) => sum + i.amount, 0);
      const expenseSum = expenses
        .filter(e => new Date(e.date).getMonth() === month)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        month: new Date(0, month).toLocaleString("default", { month: "short" }),
        Income: incomeSum,
        Expense: expenseSum
      };
    });
  }, [income, expenses]);

  // ----------------- Totals -----------------
  const totalIncome = useMemo(() => income.reduce((sum, item) => sum + item.amount, 0), [income]);
  const totalExpense = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const totalSavings = useMemo(() => savings.reduce((sum, item) => sum + item.amount, 0), [savings]);
  const walletBalance = totalIncome - totalExpense;

  // ----------------- Recent transactions -----------------
  const transactions = useMemo(() => {
    return [
      ...income.map(i => ({ ...i, type: "Income" })),
      ...expenses.map(e => ({ ...e, type: "Expense" })),
      ...savings.map(s => ({ ...s, type: "Saving" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [income, expenses, savings]);

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  return (
    <div className={`w-full h-full p-4 space-y-6 transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>

      {/* -------------------- TOP CARDS -------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Income", value: totalIncome, icon: ArrowUpCircle, color: "green" },
          { label: "Total Expense", value: totalExpense, icon: ArrowDownCircle, color: "red" },
          { label: "Savings", value: totalSavings, icon: PiggyBank, color: "blue" },
          { label: "Wallet / Bank Balance", value: walletBalance, icon: Wallet, color: "purple" },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl shadow flex items-center justify-between transform transition-transform duration-250 ease-in-out hover:shadow-lg hover:scale-[1.02]
                          ${darkMode ? "bg-neutral-900" : "bg-white"}`}
            >
              <div>
                <p className={`text-sm transition-colors duration-100 ease-in-out ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {card.label}
                </p>
                <h2 className={`text-xl font-semibold mt-1 transition-colors duration-100 ease-in-out ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                  ₹ {card.value.toLocaleString()}
                </h2>
              </div>
              <Icon className={`w-8 h-8 transition-colors duration-100 ease-in-out text-${card.color}-600 dark:text-${card.color}-400`} />
            </div>
          );
        })}
      </div>

      {/* -------------------- Income vs Expense Line Chart -------------------- */}
      <div className={`p-5 rounded-xl shadow transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-900" : "bg-white"}`}>
        <h3 className={`text-lg font-semibold mb-2 transition-colors duration-100 ease-in-out ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
          Income vs Expense (Monthly)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
            <XAxis dataKey="month" stroke={darkMode ? "#d1d5db" : "#374151"} />
            <YAxis stroke={darkMode ? "#d1d5db" : "#374151"} />
            <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1f2937" : "#fff", borderRadius: 6 }} />
            <Legend />
            <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* -------------------- RECENT TRANSACTIONS -------------------- */}
      <div className={`p-5 rounded-xl shadow transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-900" : "bg-white"}`}>
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-100 ease-in-out ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {displayedTransactions.length === 0 ? (
            <p className={`transition-colors duration-100 ease-in-out ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              No transactions yet.
            </p>
          ) : (
            displayedTransactions.map(tx => (
              <div key={tx.id} className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-150 ease-in-out ${darkMode ? "bg-neutral-800" : "bg-neutral-50"}`}>
                <div>
                  <p className="font-medium">{tx.description || tx.source}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <p className={`${tx.type === "Income" ? "text-green-600" : tx.type === "Expense" ? "text-red-500" : "text-blue-600"} font-semibold`}>
                  {tx.type === "Income" ? "+" : tx.type === "Expense" ? "-" : "+"} ₹ {tx.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {transactions.length > 5 && !showAll && (
          <button
            className="mt-3 px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700 transition"
            onClick={() => setShowAll(true)}
          >
            View More
          </button>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
