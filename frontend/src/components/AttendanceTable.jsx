import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const AttendanceTable = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance", {
        credentials: "include",
      });
      const data = await res.json();
      setAttendanceRecords(data);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };

  const filteredRecords = attendanceRecords.filter(
    (record) =>
      (statusFilter === "All" || record.status === statusFilter) &&
      record.Employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Employee Attendance</h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search Employee..."
          className="w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Present">Present</SelectItem>
            <SelectItem value="Absent">Absent</SelectItem>
            <SelectItem value="Late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>Attendance records</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRecords.length > 0 ? (
            currentRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.Employee.name}</TableCell>
                <TableCell>{record.checkInTime || "—"}</TableCell>
                <TableCell>{record.checkOutTime || "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      record.status === "Present"
                        ? "text-green-700 border-green-500"
                        : record.status === "Late"
                        ? "text-yellow-700 border-yellow-500"
                        : "text-red-700 border-red-500"
                    }
                  >
                    {record.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4" className="text-center text-gray-500">
                No attendance records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredRecords.length / recordsPerPage) }).map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 mx-1 rounded text-sm font-semibold transition ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AttendanceTable;