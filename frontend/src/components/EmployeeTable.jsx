// EmployeeTable.jsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableCaption,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function EmployeeTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState({});
  const [designations, setDesignations] = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [joiningDate, setJoiningDate] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchDesignations();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/employees", { withCredentials: true });
    setEmployees(res.data);
    setFilteredEmployees(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:5000/api/departments", { withCredentials: true });
    const map = {};
    res.data.forEach(d => (map[d.id] = d.name));
    setDepartments(map);
  };

  const fetchDesignations = async () => {
    const res = await axios.get("http://localhost:5000/api/designations", { withCredentials: true });
    const map = {};
    res.data.forEach(d => (map[d.id] = d.name));
    setDesignations(map);
  };

  const handleSearch = async () => {
    const res = await axios.get(`http://localhost:5000/api/employees?search=${searchQuery}`, {
      withCredentials: true,
    });
    setFilteredEmployees(res.data);
  };

  const handleCheckboxChange = id => {
    const copy = new Set(selectedIds);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelectedIds(copy);
  };

  const handleEdit = emp => {
    setSelectedEmployee(emp);
    setSelectedDepartment(emp.departmentId?.toString() || "");
setSelectedDesignation(emp.designationId?.toString() || "");
    setSelectedStatus(emp.status);
    setJoiningDate(new Date(emp.joiningDate));
    setIsAdding(false);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (id) {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, { withCredentials: true });
    } else {
      for (let i of selectedIds) {
        await axios.delete(`http://localhost:5000/api/employees/${i}`, { withCredentials: true });
      }
    }
    fetchEmployees();
    setSelectedIds(new Set());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    data.departmentId = selectedDepartment;
    data.designationId = selectedDesignation;
    data.status = selectedStatus;
    data.joiningDate = joiningDate?.toISOString();

    const url = isAdding ? "http://localhost:5000/api/employees" : `http://localhost:5000/api/employees/${selectedEmployee.id}`;
    const method = isAdding ? "POST" : "PUT";
    await axios({ url, method, data, withCredentials: true });
    fetchEmployees();
    setDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <div className="flex space-x-2">
          <Button variant="outline">Filter</Button>
          <Input
            placeholder="Search employees"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-80"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => { setSelectedEmployee({}); setIsAdding(true); setDialogOpen(true); }}>Add</Button>
          <Button variant="destructive" onClick={() => handleDelete(null)}>Delete</Button>
        </div>
      </div>

      <Table>
        <TableCaption>Employee Directory</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead><Checkbox disabled /></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name / Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead>Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map(emp => (
            <ContextMenu key={emp.id}>
              <ContextMenuTrigger asChild>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(emp.id)}
                      onCheckedChange={() => handleCheckboxChange(emp.id)}
                    />
                  </TableCell>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>
                    <div>{emp.name}</div>
                    <div className="text-sm text-muted-foreground">{emp.email}</div>
                  </TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>{emp.salary}</TableCell>
                  <TableCell>{emp.joiningDate}</TableCell>
                  <TableCell><Badge variant="outline">{emp.status}</Badge></TableCell>
                  {/* <TableCell>
                    <Button variant="outline" onClick={() => handleEdit(emp)}>Edit</Button>
                  </TableCell> */}
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleEdit(emp)}>Edit</ContextMenuItem>
                <ContextMenuItem onClick={() => handleDelete(emp.id)}>Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAdding ? "Add Employee" : "Edit Employee"}</DialogTitle>
            <DialogDescription>Fill in the form below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" defaultValue={selectedEmployee.name} placeholder="Name" required />
            <Input name="email" defaultValue={selectedEmployee.email} placeholder="Email" required />
            <Input name="phone" defaultValue={selectedEmployee.phone} placeholder="Phone" required />
            <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select department" />
  </SelectTrigger>
  <SelectContent>
    {Object.entries(departments).map(([id, name]) => (
      <SelectItem key={id} value={id}>{name}</SelectItem>
    ))}
  </SelectContent>
</Select>

            <Select onValueChange={setSelectedDesignation} defaultValue={selectedDesignation}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select designation" /></SelectTrigger>
              <SelectContent>
                {Object.entries(designations).map(([id, name]) => (
                  <SelectItem key={id} value={id}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input name="salary" defaultValue={selectedEmployee.salary} placeholder="Salary" />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !joiningDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {joiningDate ? format(joiningDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={joiningDate}
                  onSelect={setJoiningDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setSelectedStatus} defaultValue={selectedStatus}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
