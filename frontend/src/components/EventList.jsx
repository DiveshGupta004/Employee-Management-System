import React, { useState, useEffect } from "react";
import axios from "axios";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

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
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">📅 Event List</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Event
        </button>
      </div>
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
                <th className="p-3">Type</th>
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
                  <td className="p-3 space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                      onClick={() => openModal(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      onClick={() => handleDelete(event.event_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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