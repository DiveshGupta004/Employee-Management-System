import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const CreateEvent = () => {
  const location = useLocation();
  const selectedDate = location.state?.selectedDate || "";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: selectedDate,
    location: "",
    event_type: "",
    target_audience: [], // ✅ Dynamically populated from backend
  });

  const [events, setEvents] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]); // ✅ Define state for departments
  const [eventTypes, setEventTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, event_date: selectedDate }));
    }
  }, [selectedDate]);

  // ✅ Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/events", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    }
  };

  // ✅ Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/departments", { credentials: "include" });
      if (!response.ok) throw new Error(`Failed to fetch departments: ${response.status}`);

      const data = await response.json();
      setDepartmentOptions(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err.message);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/event-types", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch event types");
      const data = await response.json();
      setEventTypes(data);
    } catch (err) {
      console.error("Error fetching event types:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchDepartments();
    fetchEventTypes();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData);

    try {
      const response = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Include credentials
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create event");

      const data = await response.json();
      alert("Event Created Successfully!");
      console.log("Response:", data);

      setFormData({
        title: "",
        description: "",
        event_date: "",
        location: "",
        event_type: "",
        target_audience: [],
      });

      setEvents([...events, data.event]);
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Error creating event");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Create Event</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Event Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded-lg"
            placeholder="Enter event description"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Event Date</label>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="Enter location"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Event Type</label>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="" disabled>Select an event type</option>
            {eventTypes.length > 0 ? (
              eventTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))
            ) : (
              <option disabled>Loading event types...</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Target Audience (Department)</label>
          <select
            name="target_audience"
            value={formData.target_audience[0] || ""}
            onChange={(e) => setFormData({ ...formData, target_audience: [e.target.value] })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="" disabled>Select a department</option>
            {departmentOptions.length > 0 ? (
              departmentOptions.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))
            ) : (
              <option disabled>Loading departments...</option>
            )}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
