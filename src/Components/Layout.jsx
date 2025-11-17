import { useState } from "react";
import Sidebar from "./SideBar.jsx";
import Navbar from "./Navbar.jsx";
import { useTheme } from "../utilities/useTheme.js";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const { darkMode } = useTheme();

  return (
    <div className={`flex min-h-screen transition-colors transition-100 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Scrollable Content */}
        <main className={`p-6 flex-1 overflow-auto transition-colors transition-100 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
