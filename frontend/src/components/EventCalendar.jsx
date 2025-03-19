import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Tooltip } from "react-tooltip";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const EventCalendar = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(dayjs().format("DD MMMM YYYY"));
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  let clickTimeout = null;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events/all");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        const formattedEvents = data.map((event) => ({
          id: event.event_id,
          title: event.title,
          start: event.event_date,
          location: event.location,
        }));

        setEvents(formattedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Update current date when the view changes
  const updateCurrentDate = () => {
    if (calendarRef.current) {
      const newDate = calendarRef.current.getApi().view.currentStart;
      setCurrentDate(dayjs(newDate).format("DD MMMM YYYY"));
    }
  };

  useEffect(() => {
    updateCurrentDate();
  }, []);

  const handleNavigation = (action) => {
    if (!calendarRef.current) return;

    const calendarApi = calendarRef.current.getApi();

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

  const handleDateClick = (info) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      setShowCalendar(false);
      setSelectedDate(info.dateStr);
      navigate("/events", { state: { selectedDate: info.dateStr } });
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
      }, 300);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200">
      {showCalendar && (
        <>
          <h2 className="text-2xl font-extrabold mb-3 text-center text-gray-800 flex items-center justify-center gap-2">
            📅 <span>Event Calendar</span>
          </h2>

          <div className="flex justify-between items-center mb-3 px-4 bg-gray-100 p-2 rounded-md shadow-sm">
            <div className="space-x-2">
              <button
                onClick={() => handleNavigation("prev-year")}
                className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition"
              >
                «
              </button>
              <button
                onClick={() => handleNavigation("prev-month")}
                className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition"
              >
                ‹
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-800">{currentDate}</span>
              <button
                onClick={() => handleNavigation("today")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Today
              </button>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => handleNavigation("next-month")}
                className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition"
              >
                ›
              </button>
              <button
                onClick={() => handleNavigation("next-year")}
                className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition"
              >
                »
              </button>
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-white p-3">
            {loading ? (
              <p className="text-center text-gray-600">Loading events...</p>
            ) : error ? (
              <p className="text-center text-red-600">Error: {error}</p>
            ) : (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
                events={events}
                height={500}
                contentHeight={450}
                aspectRatio={1.4}
                eventContent={({ event }) => (
                  <div className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold cursor-pointer truncate hover:bg-green-600 transition duration-200">
                    {event.title}
                    <Tooltip id={`tooltip-${event.id}`} />
                  </div>
                )}
                className="p-2 rounded-md"
                themeSystem="bootstrap"
                datesSet={updateCurrentDate}
                dateClick={handleDateClick}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EventCalendar;
