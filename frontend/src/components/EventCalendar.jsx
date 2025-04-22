import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import dayjs from "dayjs";
import "@/styles/fullcalendar-dark.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EventCalendar = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(dayjs().format("DD MMMM YYYY"));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    event_type: "",
    target_audience: [],
  });
  const [eventTypes, setEventTypes] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        const formatted = data.map((event) => ({
          id: event.event_id,
          title: event.title,
          start: event.event_date,
          location: event.location,
          description: event.description,
        }));
        setEvents(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDropdowns = async () => {
      try {
        const [eventTypeRes, deptRes] = await Promise.all([
          fetch("http://localhost:5000/api/event-types", { credentials: "include" }),
          fetch("http://localhost:5000/api/departments", { credentials: "include" }),
        ]);
        const eventTypesData = await eventTypeRes.json();
        const departmentsData = await deptRes.json();
        setEventTypes(eventTypesData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Dropdown fetch error:", error);
      }
    };

    fetchEvents();
    fetchDropdowns();
  }, []);

  const updateCurrentDate = () => {
    if (calendarRef.current) {
      const today = calendarRef.current.getApi().getDate();
      setCurrentDate(dayjs(today).format("DD MMMM YYYY"));
    }
  };

  const handleNavigation = (action) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    switch (action) {
      case "prev-year": calendarApi.prevYear(); break;
      case "prev-month": calendarApi.prev(); break;
      case "next-month": calendarApi.next(); break;
      case "next-year": calendarApi.nextYear(); break;
      case "today": calendarApi.today(); break;
      default: break;
    }
    updateCurrentDate();
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setFormData((prev) => ({ ...prev, event_date: info.dateStr }));
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create event");

      const newEvent = await res.json();

      toast("✅ Event has been created!");

      setEvents((prev) => [
        ...prev,
        {
          id: newEvent.event.event_id,
          title: newEvent.event.title,
          start: newEvent.event.event_date,
          description: newEvent.event.description,
          location: newEvent.event.location,
        },
      ]);

      setDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        event_date: "",
        location: "",
        event_type: "",
        target_audience: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="p-4 w-full bg-white dark:bg-black text-gray-800 dark:text-gray-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all">
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">📅 Event Calendar</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleNavigation("prev-year")}>«</Button>
          <Button variant="outline" onClick={() => handleNavigation("prev-month")}>‹</Button>
          <Button variant="outline" onClick={() => handleNavigation("today")} className="bg-green-500 hover:bg-green-600 text-white">Today</Button>
          <Button variant="outline" onClick={() => handleNavigation("next-month")}>›</Button>
          <Button variant="outline" onClick={() => handleNavigation("next-year")}>»</Button>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
        Current view: {currentDate}
      </div>

      <div className="rounded-md overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500 dark:text-red-400 py-6">Error: {error}</p>
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            events={events}
            height={500}
            eventContent={({ event }) => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Badge className="text-xs font-medium px-2 py-1 bg-emerald-500 text-white border-none">
                        {event.title}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm">
                    <p className="font-semibold text-white">📍 {event.extendedProps.location}</p>
                    <p className="text-gray-300">📝 {event.extendedProps.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            className="rounded-md"
            datesSet={updateCurrentDate}
            dateClick={handleDateClick}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="dark:text-white">Add Event for {selectedDate}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 border rounded-md bg-white dark:bg-neutral-900 text-black dark:text-white" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-md bg-white dark:bg-neutral-900 text-black dark:text-white" />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required className="w-full px-4 py-2 border rounded-md bg-white dark:bg-neutral-900 text-black dark:text-white" />
            <Select onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
              <SelectTrigger className="w-full dark:bg-neutral-900 dark:text-white">
                <SelectValue placeholder="Select Event Type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formData.target_audience[0] || undefined} onValueChange={(value) => setFormData({ ...formData, target_audience: [value] })}>
              <SelectTrigger className="w-full dark:bg-neutral-900 dark:text-white">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
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
};

export default EventCalendar;
