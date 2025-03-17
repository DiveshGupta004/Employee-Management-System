import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const resetToToday = () => {
    const today = new Date();
    setDate(today);
    setActiveStartDate(today);
  };

  const goToPreviousMonth = () => {
    setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1));
  };

  // Highlight today's date
  const tileClassName = ({ date }) => {
    return date.toDateString() === new Date().toDateString()
      ? "bg-blue-200 text-black font-bold rounded-lg"
      : date.getDay() === 0
      ? "text-red-500"
      : "";
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md w-full max-w-sm border border-gray-300 dark:border-gray-600 h-[400px] flex flex-col justify-between">
      
      {/* Month & Year Display */}
      <div className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
        {activeStartDate.toLocaleString("default", { month: "long", year: "numeric" })}
      </div>

      {/* Calendar Container (Fixed Height) */}
      <div className="flex-grow overflow-hidden">
        <Calendar
          onChange={setDate}
          value={date}
          activeStartDate={activeStartDate}
          view="month"
          onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
          className="w-full bg-white dark:bg-gray-800 p-2 rounded-lg"
          tileClassName={tileClassName}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-3">
        <button onClick={goToPreviousMonth} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm">
          ◀ Prev
        </button>
        <button onClick={resetToToday} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          Today
        </button>
        <button onClick={goToNextMonth} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm">
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default CalendarWidget;
