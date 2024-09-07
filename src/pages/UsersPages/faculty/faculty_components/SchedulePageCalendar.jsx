import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  addDays,
  isSameMonth,
  addMonths,
  isSameDay,
} from "date-fns";

const SchedulesPageCalendar = ({ instructorSchedule }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = [
    { short: "Sun", full: "Sunday" },
    { short: "Mon", full: "Monday" },
    { short: "Tue", full: "Tuesday" },
    { short: "Wed", full: "Wednesday" },
    { short: "Thu", full: "Thursday" },
    { short: "Fri", full: "Friday" },
    { short: "Sat", full: "Saturday" },
  ];

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between p-4 border-b-[1px] border-solid border-[#d1d1d1] text-[#320000] [&_button]:text-[#320000] ">
        <h6 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h6>
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded bg-transparent"
        >
          &lt;
        </button>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded  bg-transparent"
        >
          &gt;
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    return (
      <div className="grid grid-cols-7 gap-2 p-2 ">
        {daysOfWeek.map((day, index) => {
          const isAvailable = instructorSchedule.includes(day.full);
          return (
            <div
              key={index}
              className={`text-center p-2 rounded ${
                isAvailable ? "text-[#320000]  font-bold" : "text-gray-600"
              }`}
            >
              {day.short}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const isAvailable = instructorSchedule.some((instructorDay) =>
          isSameDay(day, new Date(instructorDay))
        );

        days.push(
          <div
            key={day}
            className={`text-center p-2 rounded text-[14px] ${
              !isSameMonth(day, monthStart)
                ? "text-gray-400"
                : isAvailable
                ? "bg-green-100 text-green-800 font-semibold"
                : "text-black"
            }`}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2 mb-2" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-[30px] shadow">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderDaysInMonth()}
    </div>
  );
};

export default SchedulesPageCalendar;
