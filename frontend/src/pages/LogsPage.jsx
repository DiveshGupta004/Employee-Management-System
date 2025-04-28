"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AttendanceLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Separate Start and End Dates
  const [startDate, setStartDate] = useState(new Date(dayjs().startOf("month").format("YYYY-MM-DD")));
  const [endDate, setEndDate] = useState(new Date(dayjs().endOf("month").format("YYYY-MM-DD")));

  useEffect(() => {
    if (startDate && endDate) {
      fetchLogs();
    }
  }, [startDate, endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const start = dayjs(startDate).format("YYYY-MM-DD");
      const end = dayjs(endDate).format("YYYY-MM-DD");

      const res = await fetch(`http://localhost:5000/api/attendance/my/logs?startDate=${start}&endDate=${end}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setLogs(data.records || []);
    } catch (error) {
      console.error("Failed to fetch attendance logs", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("My Attendance Logs", 14, 15);

    const tableColumn = ["Date", "Status", "Check-In", "Check-Out"];
    const tableRows = [];

    logs.forEach((log) => {
      const logData = [
        dayjs(log.date).format("DD MMM YYYY"),
        log.status,
        log.checkInTime ? dayjs(log.checkInTime).format("hh:mm A") : "—",
        log.checkOutTime ? dayjs(log.checkOutTime).format("hh:mm A") : "—",
      ];
      tableRows.push(logData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        halign: "center",
      },
      bodyStyles: { halign: "center" },
    });

    doc.save("attendance_logs.pdf");
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">My Attendance Logs</h1>

      {/* Start and End Date Pickers + Export Button */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Start Date Picker */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick Start Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date Picker */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick End Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Export PDF Button */}
        <Button onClick={exportToPDF} className="flex gap-2 mt-6">
          <Download size={18} /> Export PDF
        </Button>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">No attendance logs for this range.</p>
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
                    <TableCell>{log.checkInTime ? dayjs(log.checkInTime).format("hh:mm A") : "—"}</TableCell>
                    <TableCell>{log.checkOutTime ? dayjs(log.checkOutTime).format("hh:mm A") : "—"}</TableCell>
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
