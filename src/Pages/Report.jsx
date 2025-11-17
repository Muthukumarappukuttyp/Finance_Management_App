// src/pages/Report.jsx
import { useState } from "react";
import { FileChartColumn, CalendarDays, Download } from "lucide-react";
import { useTheme } from "../utilities/useTheme.js";
import useData from "../utilities/useData.jsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// --- Export libraries ---
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function Report() {
  const { darkMode } = useTheme();
  const { income = [], expenses = [], investments = [], loading } = useData();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterApplied, setFilterApplied] = useState(false);
  const [chartType, setChartType] = useState("Bar"); // Bar or Line
  const [exportType, setExportType] = useState("pdf"); // pdf, csv, excel

  // ---------------- Filter function ----------------
  const filterByDate = (items) => {
    if (!items) return [];
    return items.filter(item => {
      if (!filterApplied) return true;
      const date = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) return date >= start && date <= end;
      if (start) return date >= start;
      if (end) return date <= end;
      return true;
    });
  };

  const filteredIncome = filterByDate(income);
  const filteredExpenses = filterByDate(expenses);
  const filteredInvestments = filterByDate(investments);

  // ---------------- Totals ----------------
  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalInvestment = filteredInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = filteredInvestments.reduce((sum, inv) => sum + (inv.returns || 0), 0);
  // const netBalance = totalIncome - totalExpense + totalInvestment + totalReturns;

  // ---------------- Monthly chart data ----------------
  const chartData = [];
  for (let month = 0; month < 12; month++) {
    const incomeSum = filteredIncome
      .filter(i => new Date(i.date).getMonth() === month)
      .reduce((sum, i) => sum + i.amount, 0);

    const expenseSum = filteredExpenses
      .filter(e => new Date(e.date).getMonth() === month)
      .reduce((sum, e) => sum + e.amount, 0);

    const returnsSum = filteredInvestments
      .filter(inv => new Date(inv.date).getMonth() === month)
      .reduce((sum, inv) => sum + (inv.returns || 0), 0);

    chartData.push({
      month: new Date(0, month).toLocaleString("default", { month: "short" }),
      Income: incomeSum,
      Expense: expenseSum,
      Returns: returnsSum,
    });
  }

  const handleFilter = () => setFilterApplied(true);

  // ---------------- Export function ----------------
  const handleExport = async () => {
    if (!chartData || chartData.length === 0) {
      alert("No data to export");
      return;
    }

    const dataToExport = chartData.map(d => ({
      Month: d.month,
      Income: d.Income,
      Expense: d.Expense,
      Returns: d.Returns,
    }));

    const headers = Object.keys(dataToExport[0] || {});
    if (headers.length === 0) {
      alert("No data to export");
      return;
    }

    // ---------------- CSV Export ----------------
    if (exportType === "csv") {
      const csvContent = [
        headers.join(","), 
        ...dataToExport.map(row => headers.map(h => row[h]).join(","))
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "report.csv");
    }

    // ---------------- Excel Export ----------------
    else if (exportType === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Report");
      sheet.columns = headers.map(header => ({ header, key: header }));
      dataToExport.forEach(row => sheet.addRow(row));

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      saveAs(blob, "report.xlsx");
    }

    // ---------------- PDF Export ----------------
    else if (exportType === "pdf") {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [headers],
        body: dataToExport.map(row => headers.map(h => row[h])),
        startY: 10,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      doc.save("report.pdf");
    }
  };

  if (loading) return <p className="p-4">Loading report data...</p>;

  return (
    <div className={`p-4 sm:p-6 space-y-6 transition-colors duration-250 ease-in-out ${darkMode ? "bg-neutral-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FileChartColumn size={24} /> Reports
        </h1>

        {/* Export Button + Type */}
        <div className="flex items-center gap-2">
          <select
            value={exportType}
            onChange={e => setExportType(e.target.value)}
            className={`px-3 py-2 rounded-lg ${darkMode ? "bg-neutral-800 text-white" : "bg-white border border-gray-300"} outline-none`}
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
            onClick={handleExport}
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className={`flex items-center gap-2 border px-3 py-2 rounded-lg w-full sm:w-auto ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <CalendarDays size={18} />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent outline-none w-full" />
        </div>
        <div className={`flex items-center gap-2 border px-3 py-2 rounded-lg w-full sm:w-auto ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <CalendarDays size={18} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent outline-none w-full" />
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
          <h3 className="text-sm text-neutral-500">Investments</h3>
          <p className="text-xl font-bold mt-1 text-blue-600">₹ {totalInvestment.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl border shadow-md ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <h3 className="text-sm text-neutral-500">Returns</h3>
          <p className="text-xl font-bold mt-1 text-purple-600">₹ {totalReturns.toLocaleString()}</p>
        </div>
      </div>

      {/* Chart Type Switch */}
      <div className="flex items-center gap-4">
        <button className={`px-4 py-2 rounded-lg ${chartType === "Bar" ? "bg-blue-600 text-white hover: cursor-pointer" : "bg-gray-200 dark:bg-neutral-800 text-white cursor-pointer"}`} onClick={() => setChartType("Bar")}>Bar Chart</button>
        <button className={`px-4 py-2 rounded-lg ${chartType === "Line" ? "bg-blue-600 text-white hover: cursor-pointer" : "bg-gray-200 dark:bg-neutral-800 text-white cursor-pointer"}`} onClick={() => setChartType("Line")}>Line Chart</button>
      </div>

      {/* Chart */}
      <div className={`rounded-xl border shadow-md p-4 overflow-x-auto ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
        <ResponsiveContainer width="100%" height={350}>
          {chartType === "Bar" ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="month" stroke={darkMode ? "#d1d5db" : "#374151"} />
              <YAxis stroke={darkMode ? "#d1d5db" : "#374151"} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1f2937" : "#fff", borderRadius: 6 }} />
              <Legend />
              <Bar dataKey="Income" fill="#10b981" />
              <Bar dataKey="Expense" fill="#ef4444" />
              <Bar dataKey="Returns" fill="#8b5cf6" />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="month" stroke={darkMode ? "#d1d5db" : "#374151"} />
              <YAxis stroke={darkMode ? "#d1d5db" : "#374151"} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1f2937" : "#fff", borderRadius: 6 }} />
              <Legend />
              <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Returns" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Report;
