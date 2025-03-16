import React, { useState, useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const LeaveRequestsAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves", {
        credentials: "include",
      });
      const data = await res.json();
      setLeaveRequests(data);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  const updateLeaveStatus = async (id, newStatus) => {
    const endpoint = `http://localhost:5000/api/leaves/${id}/${newStatus === "Approved" ? "approve" : "reject"}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update leave status");
      }

      setLeaveRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };

  const filteredRequests = leaveRequests.filter(
    (request) =>
      (statusFilter === "All" || request.status === statusFilter) &&
      request.Employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  return (
    <motion.div
      className="bg-gray-800 text-white p-6 rounded-lg shadow-md border border-gray-700"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <h2 className="text-2xl font-semibold mb-4">Leave Requests</h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search Employee..."
          className="p-2 border border-gray-600 rounded-md text-sm w-full md:w-1/3 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 border border-gray-600 rounded-md text-sm bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 transition"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Animated Table Wrapper */}
      <AnimatePresence>
        <motion.div
          className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-700 text-white">
              <tr>
                {["Employee", "Start Date", "End Date", "Reason", "Status", "Actions"].map((header) => (
                  <th key={header} className="p-3 text-left border border-gray-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRequests.length > 0 ? (
                currentRequests.map((request, index) => (
                  <tr
                    key={request.id}
                    className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600 transition`}
                  >
                    <td className="p-3 border border-gray-600">{request.Employee.name}</td>
                    <td className="p-3 border border-gray-600">{request.startDate}</td>
                    <td className="p-3 border border-gray-600">{request.endDate}</td>
                    <td className="p-3 border border-gray-600">{request.reason}</td>
                    <td className="p-3 border border-gray-600">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          request.status === "Approved"
                            ? "bg-green-700 text-green-200"
                            : request.status === "Rejected"
                            ? "bg-red-700 text-red-200"
                            : "bg-yellow-600 text-yellow-200"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-600">
                      {request.status === "Pending" ? (
                        <div className="space-x-2">
                          <button
                            className="text-green-400 hover:bg-green-700 px-2 py-1 rounded transition"
                            onClick={() => updateLeaveStatus(request.id, "Approved")}
                          >
                            <FiCheck className="inline w-4 h-4" />
                          </button>
                          <button
                            className="text-red-400 hover:bg-red-700 px-2 py-1 rounded transition"
                            onClick={() => updateLeaveStatus(request.id, "Rejected")}
                          >
                            <FiX className="inline w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Decision Made</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-400">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default LeaveRequestsAdmin;
