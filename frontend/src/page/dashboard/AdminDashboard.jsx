import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import useUserStore from "../../store/user";
import { removeToken } from "../../helper";
import toast from "react-hot-toast";

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
    },
    {
      name: "User Management",
      path: "/dashboard/users",
      icon: "👥",
    },
    {
      name: "Guide Verifications",
      path: "/dashboard/guide-verifications",
      icon: "✅",
    },
    {
      name: "Support Tickets",
      path: "/dashboard/support-tickets",
      icon: "🎫",
    },
    {
      name: "System Stats",
      path: "/dashboard/stats",
      icon: "📈",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-xl font-bold text-gray-800">
            🛡️ Admin Panel
          </h1>
        </div>

        <nav className="mt-10">
          <div className="px-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "admin@guidely.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 focus:outline-none"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="m4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h2 className="ml-4 text-lg font-semibold text-gray-800">
              Admin Dashboard
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Welcome, {user?.name || "Admin"}
            </span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children || <Outlet />}
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-25 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;