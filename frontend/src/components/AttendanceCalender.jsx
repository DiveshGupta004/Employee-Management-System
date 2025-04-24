import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import "@/styles/fullcalendar-dark.css";

const AttendanceCalendar = () => {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState(null);
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(dayjs().format("DD MMMM YYYY"));

  const fetchAttendance = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance/my", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch attendance");

      const { records } = await res.json();

      if (!Array.isArray(records)) {
        throw new Error("Attendance records are not in array format");
      }

      const formatted = records.map((entry) => {
        const status = entry.status?.toLowerCase();

        return {
          title:
            status === "present"
              ? "✅ Present"
              : status === "late"
              ? "⏰ Late"
              : status === "leave"
              ? "📄 Leave"
              : status === "early"
              ? "🚶 Early"
              : "❌ Absent",
          start: entry.date,
          backgroundColor:
            status === "present"
              ? "#22c55e"
              : status === "late"
              ? "#facc15"
              : status === "leave"
              ? "#3b82f6"
              : status === "early"
              ? "#fb923c"
              : "#ef4444",
          borderColor: "transparent",
          extendedProps: {
            checkIn: entry.checkInTime,
            checkOut: entry.checkOutTime,
          },
        };
      });

      setAttendance(formatted);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
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
      case "prev-year":
        calendarApi.prevYear();
        break;
      case "prev-month":
        calendarApi.prev();
        break;
      case "next-month":
        calendarApi.next();
        break;
      case "next-year":
        calendarApi.nextYear();
        break;
      case "today":
        calendarApi.today();
        break;
      default:
        break;
    }
    updateCurrentDate();
  };

  return (
    <div className="p-4 w-full bg-white dark:bg-black text-gray-800 dark:text-gray-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all">
      <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          🕒 My Attendance
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleNavigation("prev-year")}>«</Button>
          <Button variant="outline" onClick={() => handleNavigation("prev-month")}>‹</Button>
          <Button
            variant="outline"
            onClick={() => handleNavigation("today")}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Today
          </Button>
          <Button variant="outline" onClick={() => handleNavigation("next-month")}>›</Button>
          <Button variant="outline" onClick={() => handleNavigation("next-year")}>»</Button>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
        Current view: {currentDate}
      </div>

      <div className="rounded-md overflow-hidden">
        {error ? (
          <p className="text-center text-red-500 dark:text-red-400 py-6">{error}</p>
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            events={attendance}
            height={500}
            eventContent={({ event }) => {
              const title = event.title;
              const colorClass = title.includes("Present")
                ? "bg-emerald-500"
                : title.includes("Late")
                ? "bg-yellow-400"
                : title.includes("Leave")
                ? "bg-blue-500"
                : title.includes("Early")
                ? "bg-orange-400"
                : "bg-red-500";

              return (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Badge
                          className={`text-xs font-medium px-2 py-1 ${colorClass} text-white border-none`}
                        >
                          {title}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-sm">
                      <p className="font-semibold text-white dark:text-black">
                        ⏰ In: {event.extendedProps.checkIn || "-"}
                      </p>
                      <p className="text-gray-300 dark:text-black">
                        🔚 Out: {event.extendedProps.checkOut || "-"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }}
            className="rounded-md"
            datesSet={updateCurrentDate}
          />
        )}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
