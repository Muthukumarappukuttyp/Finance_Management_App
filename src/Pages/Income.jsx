// src/pages/Income.jsx
import { PlusCircle, Wallet, CalendarDays, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../utilities/useTheme.js";
import useData from "../utilities/useData.jsx";

function Income() {
  const { darkMode } = useTheme();
  const { income = [], setIncome, expenses = [], loading } = useData();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterApplied, setFilterApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // default to today
  });

  if (loading) return <p className="p-4">Loading data...</p>;

  // ---------------- Filter ----------------
  const filteredIncome = income.filter(item => {
    if (!filterApplied) return true;
    const date = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end) return date >= start && date <= end;
    if (start) return date >= start;
    if (end) return date <= end;
    return true;
  });

  const filteredExpenses = expenses.filter(item => {
    if (!filterApplied) return true;
    const date = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end) return date >= start && date <= end;
    if (start) return date >= start;
    if (end) return date <= end;
    return true;
  });

  // ---------------- Totals ----------------
  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // ---------------- Handlers ----------------
  const handleFilter = () => setFilterApplied(true);
  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setNewIncome({
      source: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncome(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveIncome = async () => {
    try {
      // Use POST request to backend
      const response = await fetch("https://finance-api-2.onrender.com/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newIncome, amount: Number(newIncome.amount) }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Server error: ${err}`);
      }

      const saved = await response.json();
      // Update local state immediately
      setIncome(prev => [...prev, saved]);
      handleModalClose();
    } catch (error) {
      console.error("Failed to add income", error);
      alert("Failed to add income. Check console for details.");
    }
  };

  return (
    <div className={`p-6 space-y-6 transition-colors duration-150 ease-in-out ${darkMode ? "bg-neutral-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold flex items-center gap-2 transition-colors duration-150 ease-in-out">
          <Wallet size={26} /> Income
        </h1>
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
          onClick={handleModalOpen}
        >
          <PlusCircle size={18} /> Add Income
        </button>
      </div>

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className={`flex items-center gap-2 border px-3 py-2 rounded-lg w-full sm:w-auto ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <CalendarDays size={18} />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent outline-none" />
        </div>
        <div className={`flex items-center gap-2 border px-3 py-2 rounded-lg w-full sm:w-auto ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <CalendarDays size={18} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent outline-none" />
        </div>
        <button className={`px-4 py-2 rounded-lg w-full sm:w-auto ${darkMode ? "bg-neutral-800 text-white hover:bg-neutral-700 cursor-pointer" : "bg-gray-200 hover:bg-gray-300 text-gray-900 cursor-pointer"}`} onClick={handleFilter}>
          Filter
        </button>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border shadow-md ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <h3 className="text-sm text-neutral-500">Total Income</h3>
          <p className="text-xl font-bold mt-1 text-green-600">₹ {totalIncome.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl border shadow-md ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <h3 className="text-sm text-neutral-500">Total Expense</h3>
          <p className="text-xl font-bold mt-1 text-red-500">₹ {totalExpense.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl border shadow-md ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <h3 className="text-sm text-neutral-500">Net Balance</h3>
          <p className="text-xl font-bold mt-1">{netBalance >= 0 ? <span className="text-green-600">₹ {netBalance.toLocaleString()}</span> : <span className="text-red-500">₹ {Math.abs(netBalance).toLocaleString()}</span>}</p>
        </div>
        <div className={`p-4 rounded-xl border shadow-md ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <h3 className="text-sm text-neutral-500">Number of Records</h3>
          <p className="text-xl font-bold mt-1">{filteredIncome.length}</p>
        </div>
      </div>

      {/* Income List */}
      <div className={`rounded-xl border shadow-md p-6 transition-colors duration-150 ease-in-out ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
        <h2 className="font-semibold text-lg mb-4">Recent Income</h2>
        {filteredIncome.length === 0 ? (
          <div className="flex justify-between items-center p-3 rounded-lg border border-dashed text-neutral-500">
            No income records available.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIncome.map((item) => (
              <div key={item.id} className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? "bg-neutral-800" : "bg-neutral-50"}`}>
                <div>
                  <p className="font-medium">{item.source} - {item.description}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-semibold">₹ {item.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Modal for Adding Income */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background overlay with blur */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={handleModalClose} // closes modal when clicking outside
          ></div>

          {/* Modal content */}
          <div
            className={`relative rounded-lg p-6 w-96 transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-900 text-gray-100" : "bg-white text-gray-900"}`}
          >
            <button
              className="absolute top-3 right-3 hover:cursor-pointer"
              onClick={handleModalClose}
            >
              <X size={18} className={darkMode ? "text-gray-100" : "text-gray-700"} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Add Income</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="source"
                placeholder="Source"
                value={newIncome.source}
                onChange={handleInputChange}
                className={`border px-3 py-2 rounded-lg w-full transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-800 border-neutral-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={newIncome.amount}
                onChange={handleInputChange}
                className={`border px-3 py-2 rounded-lg w-full transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-800 border-neutral-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newIncome.description}
                onChange={handleInputChange}
                className={`border px-3 py-2 rounded-lg w-full transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-800 border-neutral-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
              />
              <input
                type="date"
                name="date"
                value={newIncome.date}
                onChange={handleInputChange}
                className={`border px-3 py-2 rounded-lg w-full transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-800 border-neutral-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
              />
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition cursor-pointer"
                onClick={handleSaveIncome}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default Income;
