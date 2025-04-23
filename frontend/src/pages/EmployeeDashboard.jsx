import React, { useEffect, useState } from "react";
import EventCalendar from "../components/EventCalendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";

function EmployeeDashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/events/upcoming", { withCredentials: true });
        setUpcomingEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch upcoming events:", err);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Welcome back! Glad to have you with us</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">22/30 Days</p>
            <p className="text-sm text-gray-500">Present this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">2</p>
            <p className="text-sm text-gray-500">Leaves this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">5</p>
            <p className="text-sm text-gray-500">Tasks left to complete</p>
          </CardContent>
        </Card>

        {/* New Project Team Members Card */}
        <Card>
          <CardHeader>
            <CardTitle>Project Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-gray-700">
            <p className="font-medium">Alice Johnson</p>
            <p className="font-medium">Rahul Sharma</p>
            <p className="font-medium">Sneha Kapoor</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid layout for calendar and upcoming events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <EventCalendar />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border-b pb-1 last:border-0">
                  <div className="font-semibold">{event.title}</div>
                  <div>{new Date(event.event_date).toDateString()}</div>
                  <div className="text-xs text-gray-500">{event.location}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Task Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Task Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-800">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox rounded border-gray-300 text-blue-600" />
                <span>Prepare report</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox rounded border-gray-300 text-blue-600" defaultChecked />
                <span>Attend training session</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox rounded border-gray-300 text-blue-600" />
                <span>Update client records</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
