import React, { useState, useEffect } from "react";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events/all"); // Adjust the API URL if needed
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-center">📅 Created Events</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3">Title</th>
                <th className="p-3">Date</th>
                <th className="p-3">Location</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.event_id} className="text-center border-b">
                  <td className="p-3">{event.title}</td>
                  <td className="p-3">{new Date(event.event_date).toDateString()}</td>
                  <td className="p-3">{event.location}</td>
                  <td className="p-3">{event.event_type}</td>
                  <td className="p-3">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                      onClick={() => alert(`View details for ${event.title}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventList;
