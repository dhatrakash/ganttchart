import React from "react";
import Dashboard from "./Dashboard";
import { Outlet } from "react-router-dom";

// For nested components
export default function MainDash() {
  return (
    <div>
      <Dashboard />
      <Outlet />
    </div>
  );
}
