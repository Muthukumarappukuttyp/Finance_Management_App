import React, { useState, useEffect } from "react";
import DataContext from "./DataContext";

const DataProvider = ({ children }) => {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [incomeRes, expensesRes, savingsRes, investmentsRes, userRes] = await Promise.all([
          fetch("https://finance-api-2.onrender.com/income"),
          fetch("https://finance-api-2.onrender.com/expenses"),
          fetch("https://finance-api-2.onrender.com/savings"),
          fetch("https://finance-api-2.onrender.com/investments"),
          fetch("https://finance-api-2.onrender.com/user")
        ]);

        const [incomeData, expensesData, savingsData, investmentsData, userData] = await Promise.all([
          incomeRes.json(),
          expensesRes.json(),
          savingsRes.json(),
          investmentsRes.json(),
          userRes.json()
        ]);

        setIncome(incomeData || []);
        setExpenses(expensesData || []);
        setSavings(savingsData || []);
        setInvestments(investmentsData || []);
        setUser(userData || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ---- New feature: updateUser function ----
  const updateUser = async (id, updatedData) => {
    try {
      const response = await fetch(`https://finance-api-2.onrender.com/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error("Failed to update user");

      // Update local state
      setUser(prev => prev.map(u => (u.id === id ? { ...u, ...updatedData } : u)));
    } catch (err) {
      console.error("Error updating user:", err);
      throw err; // so that Settings.jsx can handle the error
    }
  };

  return (
    <DataContext.Provider
      value={{
        income,
        setIncome,
        expenses,
        setExpenses,
        savings,
        setSavings,
        investments,
        setInvestments,
        user,
        setUser,
        loading,
        refreshData: async () => {
          setLoading(true);
          try {
            const [incomeRes, expensesRes, savingsRes, investmentsRes, userRes] = await Promise.all([
              fetch("https://finance-api-2.onrender.com/income"),
              fetch("https://finance-api-2.onrender.com/expenses"),
              fetch("https://finance-api-2.onrender.com/savings"),
              fetch("https://finance-api-2.onrender.com/investments"),
              fetch("https://finance-api-2.onrender.com/user")
            ]);

            const [incomeData, expensesData, savingsData, investmentsData, userData] = await Promise.all([
              incomeRes.json(),
              expensesRes.json(),
              savingsRes.json(),
              investmentsRes.json(),
              userRes.json()
            ]);

            setIncome(incomeData || []);
            setExpenses(expensesData || []);
            setSavings(savingsData || []);
            setInvestments(investmentsData || []);
            setUser(userData || []);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        },
        updateUser, // <-- expose the new feature
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;