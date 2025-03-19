import React, { useState } from "react";
import CalendarWidget from "../components/dashboard/calenderWiggets";

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
      <CalendarWidget />
    </div>
  );
}

export default Dashboard;