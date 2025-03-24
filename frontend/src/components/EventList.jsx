import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events", { withCredentials: true });
      setEvents(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (event = null) => {
    setCurrentEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/events/${eventId}`);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="p-6 w-full mx-auto bg-gray-900 text-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Event List</h2>
        <button onClick={() => navigate("/events")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Add Event</button>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="🔍 Search Event..."
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <select className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>
      {loading ? (
        <p className="text-center text-gray-400">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Event Date</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Event Type</th>
                <th className="p-3 text-left">Target Audience</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.event_id} className="border-b border-gray-700 text-white">
                    <td className="p-3">{event.title}</td>
                    <td className="p-3">{event.description}</td>
                    <td className="p-3">{new Date(event.event_date).toLocaleString()}</td>
                    <td className="p-3">{event.location}</td>
                    <td className="p-3">{event.event_type}</td>
                    <td className="p-3">{JSON.stringify(event.target_audience)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-400">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-30">
          <div className="bg-white p-5 rounded-md shadow-lg w-80">
            <h3 className="text-lg font-medium mb-4">{currentEvent ? "Edit Event" : "Add Event"}</h3>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            {/* Form for adding or editing an event goes here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;