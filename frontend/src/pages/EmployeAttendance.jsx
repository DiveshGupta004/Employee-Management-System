import React, { useEffect, useState } from "react";
import AttendanceCalendar from "@/components/AttendanceCalender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const EmployeAttendance = () => {
  const [summary, setSummary] = useState({
    present: 0,
    late: 0,
    absent: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`
  );

  const fetchSummary = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/my/summary?month=${selectedMonth}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      toast.error("Failed to load attendance summary");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/my/logs?month=${selectedMonth}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data.records);
    } catch (error) {
      toast.error("Failed to load attendance logs");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSummary();
    fetchLogs();
  }, [selectedMonth]);

  const attendancePercentage = (() => {
    const totalDays = summary.present + summary.absent + summary.late;
    if (totalDays === 0) return 0;
    return ((summary.present / totalDays) * 100).toFixed(1);
  })();

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0");
    return `${new Date().getFullYear()}-${month}`;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 w-full">
      {/* Left: Calendar + Filter */}
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Attendance Calendar</h2>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month} value={month}>
                  {format(new Date(month + "-01"), "MMMM yyyy")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AttendanceCalendar month={selectedMonth} />

        {/* Recent Logs */}
        <div>
          <h3 className="text-lg font-medium mb-2">Recent Logs</h3>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No records found for this month.</p>
          ) : (
            <ul className="space-y-2">
              {logs.slice(0, 5).map((log, idx) => (
                <li
                  key={idx}
                  className="border rounded-lg p-2 flex justify-between text-sm bg-muted/50"
                >
                  <span>{format(new Date(log.date), "MMM d, yyyy")}</span>
                  <span className={
                    log.status === "Present" ? "text-green-600" :
                    log.status === "Late" ? "text-yellow-600" :
                    "text-red-600"
                  }>
                    {log.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right: Summary Cards */}
      <div className="w-full lg:w-[300px] flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin h-6 w-6 text-muted" />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">✅ Present</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{summary.present}</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-500">⏰ Late</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{summary.late}</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">❌ Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{summary.absent}</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">📊 Attendance %</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{attendancePercentage}%</p>
                <p className="text-sm text-muted-foreground">Overall this month</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeAttendance;
