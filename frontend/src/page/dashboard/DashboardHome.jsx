import React from "react";
import useUserStore from "../../store/user";
import DashboardSelector from "./DashboardSelector";
import LearnerDashboardHome from "./LearnerDashboardHome";
import GuideDashboardHome from "./GuideDashboardHome";
import AdminDashboardHome from "./AdminDashboardHome";

// Component to show role-based dashboard home
const DashboardHome = () => {
  const { user } = useUserStore();
  const isLearner = user?.role === "learner" || user?.role === "student";
  const isAdmin = user?.role === "admin";
  
  return (
    <DashboardSelector>
      {isAdmin ? (
        <AdminDashboardHome />
      ) : isLearner ? (
        <LearnerDashboardHome />
      ) : (
        <GuideDashboardHome />
      )}
    </DashboardSelector>
  );
};

export default DashboardHome;
