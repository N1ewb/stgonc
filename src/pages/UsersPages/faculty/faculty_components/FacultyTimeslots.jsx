import React from "react";

const FacultyTimeslots = ({ timeslots }) => {
  const sortedTimeslots = timeslots.timeslots.sort(
    (a, b) => a.time.startTime - b.time.startTime
  );

  if (sortedTimeslots.length === 0) {
    return null;
  }

  return (
    <div className="faculty-timeslot-container w-full flex flex-row flex-wrap items-center p-4 border-b border-gray-200 bg-[#273240] shadow-sm rounded-lg">
      <p className="font-semibold w-1/4 text-white">{timeslots.day}</p>
      <div className="timeslots-card-container flex flex-col w-3/4 gap-2">
        {sortedTimeslots.map((timeslot, index) => (
          <p
            key={index}
            className="text-sm text-gray-600 bg-gray-100 py-1 px-2 rounded-md m-0"
          >
            {`${timeslot.time.startTime}:00 - ${timeslot.time.endTime}:00`}
          </p>
        ))}
      </div>
    </div>
  );
};

export default FacultyTimeslots;
