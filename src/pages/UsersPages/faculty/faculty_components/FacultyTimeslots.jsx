import React from "react";

const FacultyTimeslots = ({ timeslots }) => {
  const sortedTimeslots = timeslots.timeslots.sort(
    (a, b) => a.time.startTime - b.time.startTime
  );

  return (
    <div className="faculty-timeslot-container [&_p]:m-0 flex flex-row ">
      <p
        className={`${
          sortedTimeslots.length !== 0 ? "font-semibold w-1/4" : "hidden"
        }`}
      >
        {timeslots.day}
      </p>
      <div className="timeslots-card-container flex flex-col w-1/4">
        {sortedTimeslots.length !== 0 &&
          sortedTimeslots.map((timeslot, index) => (
            <p
              key={index}
            >{`${timeslot.time.startTime}:00 - ${timeslot.time.endTime}:00`}</p>
          ))}
      </div>
    </div>
  );
};

export default FacultyTimeslots;
