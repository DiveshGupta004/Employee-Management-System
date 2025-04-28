import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AttendanceLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/attendance/my/logs?month=2025-04', {
            method: 'GET',
            credentials: 'include'  // ✅ this is required to send cookies
          });
        const data = await res.json();
        setLogs(data.records || []);
      } catch (error) {
        console.error("Failed to fetch attendance logs", error);
      }
    };

    fetchLogs();
  }, [selectedMonth]);

  const renderMonthOptions = () => {
    const months = [];
    const currentYear = dayjs().year();
    for (let i = 0; i < 12; i++) {
      const value = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
      const label = dayjs(value).format("MMMM YYYY");
      months.push(<SelectItem key={value} value={value}>{label}</SelectItem>);
    }
    return months;
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">My Attendance Logs</h1>

      <div className="w-[250px]">
        <Select value={selectedMonth} onValueChange={(val) => setSelectedMonth(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>{renderMonthOptions()}</SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-4">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attendance logs for this month.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-In</TableHead>
                  <TableHead>Check-Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{dayjs(log.date).format("DD MMM YYYY")}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "Present" ? "default" : "destructive"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.checkInTime || "—"}</TableCell>
                    <TableCell>{log.checkOutTime || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceLogsPage;
