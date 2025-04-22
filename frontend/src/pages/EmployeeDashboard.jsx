import React from 'react';
import EventCalendar from "../components/EventCalendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function EmployeeDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the employee dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>My Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <EventCalendar />
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeeDashboard;
