import React, { useState } from "react";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    event_type: "Conference",
    target_audience: "HR",
    rsvp_deadline: "",
    reminder_time: "",
    calendar_integration: "Google",
  });

  const eventTypes = ["Conference", "Meeting", "Workshop", "Seminar"];
  const departmentOptions = ["HR", "IT", "Marketing", "Finance"];
  const calendarOptions = ["Google", "Outlook", "None"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData);

    try {
      const response = await fetch("http://localhost:5000/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const data = await response.json();
      alert("Event Created Successfully!");
      console.log("Response:", data);

      setFormData({
        title: "",
        description: "",
        event_date: "",
        location: "",
        event_type: "Conference",
        target_audience: "HR",
        rsvp_deadline: "",
        reminder_time: "",
        calendar_integration: "Google",
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Error creating event");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Create Event</h2>
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
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Target Audience (Department)</label>
          <select
            name="target_audience"
            value={formData.target_audience}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">RSVP Deadline</label>
          <input
            type="date"
            name="rsvp_deadline"
            value={formData.rsvp_deadline}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Reminder Time</label>
          <input
            type="text"
            name="reminder_time"
            value={formData.reminder_time}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="E.g., 1 day before"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Calendar Integration</label>
          <select
            name="calendar_integration"
            value={formData.calendar_integration}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            {calendarOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
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
