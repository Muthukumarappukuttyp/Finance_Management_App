import { useState } from "react";
import { Menu, User, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "../utilities/useTheme.js";
import useData from "../utilities/useData.jsx";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { darkMode, setDarkMode } = useTheme();
  const { user } = useData();
  const [hoverUser, setHoverUser] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Mask function fixed
  const maskText = (text, startVisible = 3, endVisible = 3) => {
    if (!text) return "";
    text = String(text); // FIX ADDED
    const maskedLength = text.length - (startVisible + endVisible);
    if (maskedLength <= 0) return text;
    return (
      text.slice(0, startVisible) +
      "*".repeat(maskedLength) +
      text.slice(-endVisible)
    );
  };

  return (
    <>
      <nav
        className={`w-full h-17 px-4 flex items-center justify-between shadow-sm relative z-50 transition-colors duration-100 ease-out
          ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} border-b`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg cursor-pointer md:hidden relative z-50 transition-colors duration-100 ease-out
              ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          >
            <Menu size={22} className={`${darkMode ? "text-white" : "text-black"}`} />
          </button>
        </div>

        <div className="hidden md:flex items-center justify-center w-1/3">
          <div className="flex items-center gap-3 px-5 py-2 rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg transform transition-transform duration-150 hover:scale-100 cursor-default select-none">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
            <h2 className="text-white font-semibold text-lg tracking-wider">
              Finance Pulse
            </h2>
            <div className="w-16 h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-white/50 animate-[pulseBar_2s_infinite]"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors duration-100 ease-out ${
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>

          <button
            className={`p-2 rounded-lg relative transition-colors duration-100 ease-out ${
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <Bell size={20} className={`${darkMode ? "text-white" : "text-black"}`} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-colors duration-100 ease-out ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
            onMouseEnter={() => setHoverUser(true)}
            onMouseLeave={() => setHoverUser(false)}
          >
            <User size={20} className={`${darkMode ? "text-gray-300" : "text-gray-600"}`} />

            {hoverUser && user && user.length > 0 && (
              <div
                className={`absolute top-12 right-0 w-64 p-4 rounded-xl shadow-lg z-50 transition-all duration-300 pointer-events-auto
                  ${darkMode ? "bg-neutral-800 text-gray-100" : "bg-white text-gray-900"}`}
                style={{ pointerEvents: "auto" }}
              >
                <h3 className="font-semibold text-lg mb-2">{user[0]?.name}</h3>
                <p className="text-sm">Email: {maskText(user[0]?.email, 3, 3)}</p>
                <p className="text-sm">Phone: {maskText(user[0]?.phone, 2, 2)}</p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div
          className="fixed top-0 left-64 right-0 bottom-0 bg-black/30 z-40 md:hidden transition-opacity duration-100 ease-out"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
