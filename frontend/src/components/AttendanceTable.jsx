"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";

const AttendanceTable = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchAttendanceRecords = async () => {
    try {
      const params = new URLSearchParams();

      params.append("page", currentPage);
      params.append("limit", recordsPerPage);

      if (statusFilter !== "All") params.append("status", statusFilter);
      if (startDate) params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`http://localhost:5000/api/attendance/all?${params.toString()}`, {
        credentials: "include",
      });

      const data = await res.json();
      setAttendanceRecords(data.records || []);
      setTotalRecords(data.totalRecords || 0);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, [currentPage, statusFilter, startDate, endDate, searchQuery]);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const exportToPDF = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (startDate) params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));
      if (searchQuery) params.append("search", searchQuery);
  
      const res = await fetch(`http://localhost:5000/api/attendance/export?${params.toString()}`, {
        credentials: "include",
      });
  
      const fullData = await res.json();
  
      const doc = new jsPDF();
      doc.text("Full Employee Attendance Records", 14, 15);
  
      const tableColumn = ["Employee", "Email", "Date", "Check-In", "Check-Out", "Status"];
      const tableRows = [];
  
      fullData.forEach((record) => {
        const row = [
          record.employee?.name || "Unknown",
          record.employee?.email || "No Email",
          format(new Date(record.date), "dd MMM yyyy"),
          record.checkInTime ? format(new Date(record.checkInTime), "hh:mm a") : "—",
          record.checkOutTime ? format(new Date(record.checkOutTime), "hh:mm a") : "—",
          record.status
        ];
        tableRows.push(row);
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
  
      doc.save("full_attendance_records.pdf");
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };
  
  const exportToCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (startDate) params.append("startDate", format(startDate, "yyyy-MM-dd"));
      if (endDate) params.append("endDate", format(endDate, "yyyy-MM-dd"));
      if (searchQuery) params.append("search", searchQuery);
  
      const res = await fetch(`http://localhost:5000/api/attendance/export?${params.toString()}`, {
        credentials: "include",
      });
  
      const fullData = await res.json();
  
      const headers = ["Employee", "Email", "Date", "Check-In", "Check-Out", "Status"];
      const rows = fullData.map(record => [
        record.employee?.name || "Unknown",
        record.employee?.email || "No Email",
        format(new Date(record.date), "dd MMM yyyy"),
        record.checkInTime ? format(new Date(record.checkInTime), "hh:mm a") : "—",
        record.checkOutTime ? format(new Date(record.checkOutTime), "hh:mm a") : "—",
        record.status
      ]);
  
      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "full_attendance_records.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };
  
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Employee Attendance</h2>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search Employee..."
          className="w-full md:w-1/4"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Present">Present</SelectItem>
            <SelectItem value="Absent">Absent</SelectItem>
            <SelectItem value="Late">Late</SelectItem>
            <SelectItem value="Leave">Leave</SelectItem>
            <SelectItem value="Early">Early</SelectItem>
          </SelectContent>
        </Select>

        {/* Start Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Start Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                setStartDate(date);
                setCurrentPage(1);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* End Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "End Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                setEndDate(date);
                setCurrentPage(1);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Export PDF */}
        <div className="flex gap-2 ml-auto">
  <Button onClick={exportToCSV}>
    Export CSV
  </Button>
  <Button onClick={exportToPDF}>
    <Download className="mr-2 h-4 w-4" /> Export PDF
  </Button>
</div>
      </div>

      {/* Attendance Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Check-In</TableHead>
            <TableHead>Check-Out</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceRecords.length > 0 ? (
            attendanceRecords.map((record) => (
              <TableRow
                key={record.id}
                className={
                  record.status === "Present"
                    ? "bg-green-50"
                    : record.status === "Late"
                    ? "bg-yellow-50"
                    : "bg-red-50"
                }
              >
                <TableCell>{record.employee?.name || "Unknown"}</TableCell>
                <TableCell>{record.employee?.email || "—"}</TableCell>
                <TableCell>{format(new Date(record.date), "dd MMM yyyy")}</TableCell>
                <TableCell>{record.checkInTime ? format(new Date(record.checkInTime), "hh:mm a") : "—"}</TableCell>
                <TableCell>{record.checkOutTime ? format(new Date(record.checkOutTime), "hh:mm a") : "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{record.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" className="text-center">
                No attendance records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AttendanceTable;
