import React, { useState } from "react";
import EventCalendar from "../components/EventCalendar";
function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
      <EventCalendar /> 
    </div>
  );
}

export default Dashboard;