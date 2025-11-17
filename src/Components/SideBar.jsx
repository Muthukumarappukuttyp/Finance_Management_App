import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, ArrowDownCircle, PiggyBank, LineChart, Settings, LogOut,} from "lucide-react";
import { useTheme } from "../utilities/useTheme.js";

export default function Sidebar({ isOpen }) {
  const { darkMode } = useTheme();

  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { title: "Income", icon: <Wallet size={20} />, path: "/income" },
    { title: "Expenses", icon: <ArrowDownCircle size={20} />, path: "/expenses" },
    { title: "Savings", icon: <PiggyBank size={20} />, path: "/savings" },
    { title: "Investments", icon: <LineChart size={20} />, path: "/investments" },
    { title: "Reports", icon: <LineChart size={20} />, path: "/reports" },
    { title: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
        <div
        className={`fixed top-0 left-0 h-screen w-64 flex flex-col transition-100
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
        shadow-xl transform transition-transform duration-300 z-45
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} md:static`}
    >
    {/* Header */}
    <div className={`p-5 text-xl font-bold tracking-wide border-b transition-100 ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
        Capital Compass
    </div>

      {/* Menu */}
      <div className="mt-4 flex flex-col gap-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 rounded-lg transition
               ${darkMode ?  `hover:text-white hover:bg-gray-700 ` : `hover:text-gray-900 hover:bg-gray-200`}
               ${isActive ? `transition-100 ${darkMode ? "bg-gray-800" : "bg-gray-200"} font-semibold` : `transition-100 ${darkMode ? "text-gray-300" : "text-gray-700"}`}`
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div
        className={`absolute bottom-0 w-full p-4 border-t transition-100 ${
          darkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Static Icon with DarkMode Conditional Rendering */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              darkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          >
            <Wallet className={`w-4 h-4 transition-colors ${darkMode ? "text-gray-100" : "text-gray-700"}`} />
          </div>

          {/* Static Text with DarkMode Conditional Rendering */}
          <div className={`text-sm space-y-1 transition-colors ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p className={darkMode ? "text-gray-100" : "text-gray-900"}>Track your money, effortlessly</p>
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>All rights reserved © 2025</p>
          </div>
        </div>
      </div>

    </div>
  );
}
