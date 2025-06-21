import React from "react";
import Sidebar from "../../components/Sidebar";
import DashbordNavbar from "../../components/DashboardNavbar";

const Dashboard = ({ children }) => {
  return (
    <div>
      <DashboardNavbar />
      <div className="flex">
        {/* Sidebar */}
        <Sidear />

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Dashboard;
