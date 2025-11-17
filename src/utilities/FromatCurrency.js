import { useEffect, useState } from "react";
import { Plus, Filter } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

export default function Expense({ api }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await api.get("/expenses");
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, [api]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl shadow">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-300 dark:border-neutral-700">
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-2 text-gray-500 dark:text-gray-400">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="border-b dark:border-neutral-700">
                    <td>{exp.date}</td>
                    <td>{exp.category}</td>
                    <td>{exp.description}</td>
                    <td>{formatCurrency(exp.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
