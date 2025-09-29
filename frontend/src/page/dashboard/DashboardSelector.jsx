import React from "react";
import useUserStore from "../../store/user";
import GuideDashboard from "./GuideDashboard";
import LearnerDashboard from "./LearnerDashboard";
import AdminDashboard from "./AdminDashboard";

const DashboardSelector = ({ children }) => {
  const { user } = useUserStore();

  if (!user) return <div>Loading...</div>;

  if (user.role === "admin") {
    return <AdminDashboard>{children}</AdminDashboard>;
  }
  if (user.role === "mentor" || user.role === "guide") {
    return <GuideDashboard>{children}</GuideDashboard>;
  }
  if (user.role === "learner" || user.role === "student") {
    return <LearnerDashboard>{children}</LearnerDashboard>;
  }
  return <div>Unauthorized or unknown user role.</div>;
};

export default DashboardSelector;
