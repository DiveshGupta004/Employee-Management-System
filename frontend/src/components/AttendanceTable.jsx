import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import Framer Motion

const AttendanceTable = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  // Fetch Attendance Records
  const fetchAttendanceRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance", {
        credentials: "include",
      });
      const data = await res.json();
      setAttendanceRecords(data);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };

  // Filter & search logic
  const filteredRecords = attendanceRecords.filter(
    (record) =>
      (statusFilter === "All" || record.status === statusFilter) &&
      record.Employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div
      className="bg-gray-800 text-white p-6 rounded-lg shadow-md border border-gray-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-4">Employee Attendance</h2>

      {/* Search & Filter Section */}
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
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </div>

      {/* Attendance Records Table */}
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
                {["Employee", "Check-in", "Check-out", "Status"].map((header) => (
                  <th key={header} className="p-3 text-left border border-gray-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentRecords.length > 0 ? (
                  currentRecords.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                      } hover:bg-gray-600 transition-all duration-200`}
                    >
                      <td className="p-3 border border-gray-600">{record.Employee.name}</td>
                      <td className="p-3 border border-gray-600">{record.checkInTime || "—"}</td>
                      <td className="p-3 border border-gray-600">{record.checkOutTime || "—"}</td>
                      <td className="p-3 border border-gray-600">
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            record.status === "Present"
                              ? "bg-green-700 text-green-200"
                              : record.status === "Late"
                              ? "bg-yellow-600 text-yellow-200"
                              : "bg-red-700 text-red-200"
                          }`}
                        >
                          {record.status}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="4" className="text-center p-4 text-gray-400">
                      No attendance records found.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredRecords.length / recordsPerPage) }).map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 mx-1 rounded text-sm font-semibold transition ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default AttendanceTable;
