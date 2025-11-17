import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./utilities/ThemeProvider.jsx"; // theme provider
import DataProvider from "./utilities/DataProvider.jsx"; // data provider
import Dashboard from "./Pages/Dashboard.jsx";
import Expense from "./Pages/Expense.jsx";
import Income from "./Pages/Income.jsx";
import Investments from "./Pages/Investments.jsx";
import Savings from "./Pages/Savings.jsx";
import Report from "./Pages/Report.jsx";
import Settings from "./Pages/Settings.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <DataProvider> {/* wrap with data provider */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="expenses" element={<Expense />} />
              <Route path="income" element={<Income />} />
              <Route path="investments" element={<Investments />} />
              <Route path="savings" element={<Savings />} />
              <Route path="reports" element={<Report />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  </React.StrictMode>
);