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
} from "date-fns";

import "./Calendar.css";

const Calendar = ({
  setAppointmentDate,
  instructorSchedule,
  selectedDate,
  setSelectedDate,
}) => {
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

  const handleDateClick = (date) => {
    setAppointmentDate(date);
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  const renderHeader = () => {
    return (
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h6>{format(currentDate, "MMMM yyyy")}</h6>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
    );
  };

  const renderDays = () => {
    return (
      <div className="days row">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="col">
            {day.short}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const today = new Date();

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const dayOfWeek = daysOfWeek[day.getDay()].full;
        const dateWithoutTime = format(day, "yyyy-MM-dd");

        const cloneDay = {
          dayOfWeek,
          dateWithoutTime,
          fullDate: day,
        };

        const isPast = day < today;
        const isSelected = selectedDate?.dateWithoutTime === dateWithoutTime;
        const isInstructorAvailable = instructorSchedule.includes(
          cloneDay.dayOfWeek
        );

        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart) ? "disabled" : ""
            } ${isPast ? "disabled" : ""} ${
              isInstructorAvailable ? "instructor-available" : ""
            } ${isSelected ? "selected" : ""}`}
            key={dateWithoutTime}
            onClick={() => !isPast && handleDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
