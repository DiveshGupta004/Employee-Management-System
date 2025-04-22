import React, { useEffect, useState } from "react";
import EventCalendar from "../components/EventCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalDesignations: 0,
    pendingLeaves: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, deptRes, desigRes, leaveRes] = await Promise.all([
          axios.get("http://localhost:5000/api/employees", { withCredentials: true }),
          axios.get("http://localhost:5000/api/departments", { withCredentials: true }),
          axios.get("http://localhost:5000/api/designations", { withCredentials: true }),
          axios.get("http://localhost:5000/api/leaves", { withCredentials: true }),
        ]);

        const pendingLeaveCount = leaveRes.data.filter(
          (leave) => leave.status === "Pending"
        ).length;

        setStats({
          totalEmployees: empRes.data.length,
          totalDepartments: deptRes.data.length,
          totalDesignations: desigRes.data.length,
          pendingLeaves: pendingLeaveCount,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    const fetchRecentActivities = async () => {
      try {
        const leaveRes = await axios.get("http://localhost:5000/api/leaves", { withCredentials: true });
        const empRes = await axios.get("http://localhost:5000/api/employees", { withCredentials: true });

        const latestLeaves = leaveRes.data.slice(0, 5).map(l => `${l.Employee.name} applied for ${l.LeaveType.type}`);
        const latestEmployees = empRes.data.slice(-5).map(e => `${e.name} was added as ${e.designation}`);

        setRecentActivities([...latestLeaves, ...latestEmployees]);
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
      }
    };

    const fetchUpcomingEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/events/upcoming", { withCredentials: true });
        setUpcomingEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch upcoming events:", err);
      }
    };

    fetchStats();
    fetchRecentActivities();
    fetchUpcomingEvents();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalEmployees}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Departments</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalDepartments}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Designations</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalDesignations}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.pendingLeaves}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2">
          <EventCalendar />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              {recentActivities.map((activity, index) => (
                <p key={index} className="border-b pb-1 last:border-0">
                  {activity}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              {upcomingEvents.map((event) => (
                <div key={event.event_id} className="border-b pb-1 last:border-0">
                  <div className="font-semibold">{event.title}</div>
                  <div>{new Date(event.event_date).toDateString()}</div>
                  <div className="text-xs text-gray-500">{event.location}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;