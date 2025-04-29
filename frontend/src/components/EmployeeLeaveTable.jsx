"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

const LeaveRequestsEmployee = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveTypes();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves/allleaves", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setLeaveRequests(data);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leave-types", {
        credentials: "include",
      });
      const data = await res.json();
      setLeaveTypes(data || []);
    } catch (err) {
      console.error("Error fetching leave types:", err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        leaveTypeId: leaveType,
        reason,
      };
      await fetch("http://localhost:5000/api/leaves", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setTimeout(() => {
        fetchLeaveRequests();
      }, 500);

      setDialogOpen(false);
      setStartDate(null);
      setEndDate(null);
      setLeaveType("");
      setReason("");
      toast("Leave has been applied successfully! ✅");
    } catch (err) {
      console.error("Error applying for leave:", err);
    }
  };

  const filteredRequests = leaveRequests.filter(
    (request) =>
      (statusFilter === "All" || request.status === statusFilter) &&
      (request?.Employee?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">My Leave Requests</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setDialogOpen(true)}>Apply</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.startDate ? format(new Date(req.startDate), "PPP") : "-"}</TableCell>
                <TableCell>{req.endDate ? format(new Date(req.endDate), "PPP") : "-"}</TableCell>
                <TableCell>{req?.LeaveType?.type || "-"}</TableCell>
                <TableCell>{req.reason || "-"}</TableCell>
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No leave requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Apply Leave Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>Fill the form below to submit a leave request.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApply} className="space-y-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Start Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>End Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Leave Type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.length > 0 ? (
                  leaveTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.type}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No leave types available</SelectItem>
                )}
              </SelectContent>
            </Select>

            <Input
              placeholder="Reason for leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveRequestsEmployee;
