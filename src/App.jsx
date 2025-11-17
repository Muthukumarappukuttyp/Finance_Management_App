import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/SideBar.jsx";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "./utilities/useTheme.js"; // useTheme hook

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useTheme(); // access darkMode state

  return (
    <div
      className={`flex h-screen text-gray-900 dark:text-gray-100 ${
        darkMode ? "bg-neutral-900" : "bg-gray-100"
      }`}
    >
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
