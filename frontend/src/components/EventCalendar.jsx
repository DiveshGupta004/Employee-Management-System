import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events/all");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        
        // Format events to match FullCalendar's expected structure
        const formattedEvents = data.map(event => ({
          id: event.event_id, // Assuming event_id is unique
          title: event.title,
          start: event.event_date, // Ensure this is in proper ISO format
          location: event.location
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
  
  return (
    <div className="p-6 max-w-2xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl border border-gray-300">
      <h2 className="text-3xl font-extrabold mb-4 text-center text-white flex items-center justify-center gap-2">
        📅 <span>Event Calendar</span>
      </h2>
      <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white p-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-600">Error: {error}</p>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            events={events}
            height={400} // Adjusted height for a more compact look
            eventColor="#9333ea" // Purple event color
            className="p-2 rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
