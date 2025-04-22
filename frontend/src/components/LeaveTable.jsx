import React, { useState, useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LeaveRequestsAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves", {
        credentials: "include",
      });
      const data = await res.json();
      setLeaveRequests(data);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  const updateLeaveStatus = async (id, newStatus) => {
    const endpoint = `http://localhost:5000/api/leaves/${id}/${newStatus === "Approved" ? "approve" : "reject"}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update leave status");
      }

      setLeaveRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };

  const filteredRequests = leaveRequests.filter(
    (request) =>
      (statusFilter === "All" || request.status === statusFilter) &&
      request.Employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Leave Requests</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search Employee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>List of leave requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.Employee.name}</TableCell>
                <TableCell>{req.startDate}</TableCell>
                <TableCell>{req.endDate}</TableCell>
                <TableCell>{req.LeaveType.type}</TableCell>
                <TableCell>{req.reason}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      req.status === "Approved"
                        ? "bg-green-200 text-green-700"
                        : req.status === "Rejected"
                        ? "bg-red-200 text-red-700"
                        : "bg-yellow-200 text-yellow-700"
                    }
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {req.status === "Pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateLeaveStatus(req.id, "Approved")}
                      >
                        <FiCheck className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateLeaveStatus(req.id, "Rejected")}
                      >
                        <FiX className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Decision Made</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No leave requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaveRequestsAdmin;