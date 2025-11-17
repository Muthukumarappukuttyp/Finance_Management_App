// src/pages/Settings.jsx

import { useState, useEffect } from "react";
import { User, Bell, Moon, Globe, Shield, Save } from "lucide-react";
import { useTheme } from "../utilities/useTheme.js";
import useData from "../utilities/useData.jsx";

function Settings() {
  const { darkMode, setDarkMode } = useTheme();
  const { user, refreshData } = useData(); // use refreshData instead of fetchUser

  // ----- Local state for profile -----
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: false,
    smsAlerts: false,
    monthlyReport: false,
  });

  const [language, setLanguage] = useState("English (Default)");

  // Notification card state
  const [notification, setNotification] = useState({
    message: "",
    type: "", // "success" or "error"
    visible: false,
  });

  // Sync profile state with user data
  useEffect(() => {
    if (user && user.length > 0) {
      setProfile({
        fullName: "",
        email: "",
        phone: "",
        password: "",
      });
    }
  }, [user]);

  // Handle profile input change
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Handle notification toggle
  const handleNotificationChange = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Show notification card
  const showNotification = (message, type = "success") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 3000);
  };

  // Save changes
  const handleSaveChanges = async () => {
    if (!profile.fullName || !profile.email || !profile.phone || !profile.password) {
      showNotification("Please fill in all fields before saving!", "error");
      return;
    }

    try {
      const response = await fetch(`https://finance-api-2.onrender.com/user/${user[0].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          password: profile.password,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      await refreshData(); // refresh all data including user
      showNotification("Profile updated successfully ✅", "success");
    } catch (error) {
      console.error(error);
      showNotification("Failed to update profile ❌", "error");
    }
  };

  return (
    <div className={`p-6 space-y-8 transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2 transition-colors duration-100 ease-in-out">
          <Shield size={26} /> Settings
        </h1>

        <button
          onClick={handleSaveChanges}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-100 ease-in-out ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} hover:cursor-pointer`}
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      {/* Profile Section */}
      <div className={`p-6 rounded-xl border shadow-sm space-y-4 transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
        <h2 className="font-semibold flex items-center gap-2 transition-colors duration-100 ease-in-out">
          <User size={20} /> Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["fullName", "email", "phone", "password"].map((field, idx) => (
            <input
              key={idx}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              placeholder={field === "fullName" ? "Full Name" : field === "email" ? "Email Address" : field === "phone" ? "Phone Number" : "Change Password"}
              value={profile[field]}
              onChange={(e) => handleProfileChange(field, e.target.value)}
              className={`border p-2 rounded-lg transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-800 border-neutral-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
            />
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`p-6 rounded-xl border shadow-sm space-y-4 transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
        <h2 className="font-semibold flex items-center gap-2 transition-colors duration-100 ease-in-out">
          <Bell size={20} /> Notifications
        </h2>
        <div className="space-y-3">
          {["emailAlerts", "smsAlerts", "monthlyReport"].map((key) => (
            <label key={key} className="flex justify-between items-center">
              <span>{key === "emailAlerts" ? "Email Alerts" : key === "smsAlerts" ? "SMS Alerts" : "Monthly Summary Report"}</span>
              <input type="checkbox" checked={notifications[key]} onChange={() => handleNotificationChange(key)} className="w-5 h-5" />
            </label>
          ))}
        </div>
      </div>

      {/* Preferences Section */}
      <div className={`p-6 rounded-xl border shadow-sm space-y-4 transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
        <h2 className="font-semibold flex items-center gap-2 transition-colors duration-100 ease-in-out">
          <Globe size={20} /> Preferences
        </h2>

        {/* Theme Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon size={18} />
            <p>Dark Mode</p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-7 rounded-full relative transition-colors duration-100 ease-out ${darkMode ? "bg-blue-600 hover:bg-gray-800 cursor-pointer" : "bg-neutral-400 hover:bg-gray-100 cursor-pointer"}`}
          >
            <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-100 ease-out ${darkMode ? "translate-x-7" : ""}`} />
          </button>
        </div>

        {/* Language */}
        <div className="flex justify-between items-center mt-4">
          <p>Language</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`border px-3 py-2 rounded-lg transition-colors duration-100 ease-in-out ${darkMode ? "bg-neutral-800 border-neutral-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
          >
            <option>English (Default)</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>
        </div>
      </div>

      {/* Custom Notification Card */}
      {notification.visible && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-lg transition-all duration-300
          ${notification.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"} ${darkMode ? "bg-opacity-90" : ""}`}>
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

    </div>
  );
}

export default Settings;
