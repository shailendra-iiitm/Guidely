import React from "react";
import LearnerSidebar from "../../components/LearnerSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";

const LearnerDashboard = ({ children }) => {
  return (
    <div>
      <DashboardNavbar />
      <div className="flex">
        {/* Learner Sidebar */}
        <LearnerSidebar />

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default LearnerDashboard;
