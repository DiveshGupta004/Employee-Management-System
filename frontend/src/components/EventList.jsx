import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [date, setDate] = useState();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    event_type: '',
    target_audience: []
  });

  useEffect(() => {
    fetchEvents();
    fetchEventTypes();
    fetchDepartments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterType, events]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      applyFilters();
    }
  }, [searchQuery]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events", { withCredentials: true });
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let updatedEvents = events;
    
    const now = new Date();
    if (filterType === "upcoming") {
      updatedEvents = updatedEvents.filter(event => new Date(event.event_date) > now);
    } else if (filterType === "past") {
      updatedEvents = updatedEvents.filter(event => new Date(event.event_date) < now);
    }
    
    setFilteredEvents(updatedEvents);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      applyFilters();
      return;
    }
    let updatedEvents = events.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const now = new Date();
    if (filterType === "upcoming") {
      updatedEvents = updatedEvents.filter(event => new Date(event.event_date) > now);
    } else if (filterType === "past") {
      updatedEvents = updatedEvents.filter(event => new Date(event.event_date) < now);
    }
    
    setFilteredEvents(updatedEvents);
  };

  const fetchEventTypes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/event-types", { credentials: "include" });
      const data = await res.json();
      setEventTypes(data);
    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/departments", { credentials: "include" });
      const data = await response.json();
      setDepartmentOptions(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const openDialog = (event = null) => {
    if (event) {
      setCurrentEvent(event);
      setDate(new Date(event.event_date));
      setFormData({
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        location: event.location,
        event_type: event.event_type,
        target_audience: event.target_audience || []
      });
    } else {
      setCurrentEvent(null);
      setDate();
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        event_type: '',
        target_audience: []
      });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentEvent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, event_date: date };
    try {
      if (currentEvent) {
        await axios.put(`http://localhost:5000/events/${currentEvent.event_id}`, payload, { withCredentials: true });
      } else {
        await axios.post("http://localhost:5000/events", payload, { withCredentials: true });
      }
      fetchEvents();
      closeDialog();
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/events/${id}`, { withCredentials: true });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Event List</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentEvent ? "Edit Event" : "Add Event"}</DialogTitle>
              <DialogDescription>
                {currentEvent ? "Update event details." : "Fill in the details to add a new event."}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
                required
                className="w-full px-4 py-2 border rounded-md text-sm"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Description"
                className="w-full px-4 py-2 border rounded-md text-sm"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                required
                className="w-full px-4 py-2 border rounded-md text-sm"
              />
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, event_type: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, target_audience: [value] }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <Table>
          <TableCaption>List of upcoming events</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <ContextMenu key={event.event_id}>
                <ContextMenuTrigger asChild>
                  <TableRow>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{new Date(event.event_date).toDateString()}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.event_type}</TableCell>
                    <TableCell>{event.target_audience?.[0] || '-'}</TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => openDialog(event)}>Edit</ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDelete(event.event_id)}>Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default EventList;
