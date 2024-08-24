import React, { useEffect, useState } from "react";
import "./admin_schedules.css";
import SchedulesModal from "../../../../components/modal/schedules-modal/SchedulesModal";
import toast from "react-hot-toast";

const AdminSchedulesPage = ({ teachersList, db }) => {
  const toastMessage = (message) => toast(message);

  const [show, setShow] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [schedules, setSchedules] = useState();
  const [choosenCells, setChoosenCells] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // const daysOfWeek = [
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  //   "Sunday",
  // ];

  // const times = [
  //   "07:00-08:00",
  //   "08:00-09:00",
  //   "09:00-10:00",
  //   "10:00-11:00",
  //   "11:00-12:00",
  //   "12:00-13:00",
  //   "13:00-14:00",
  //   "14:00-15:00",
  //   "15:00-16:00",
  //   "16:00-17:00",
  //   "17:00-18:00",
  //   "18:00-19:00",
  //   "19:00-20:00",
  // ];

  const times = [
    {
      startTime: 7,
      endTime: 8,
    },
    {
      startTime: 8,
      endTime: 9,
    },
    {
      startTime: 9,
      endTime: 10,
    },
    {
      startTime: 10,
      endTime: 11,
    },
    {
      startTime: 11,
      endTime: 12,
    },
    {
      startTime: 12,
      endTime: 13,
    },
    {
      startTime: 13,
      endTime: 14,
    },
    {
      startTime: 14,
      endTime: 15,
    },
    {
      startTime: 16,
      endTime: 17,
    },
    {
      startTime: 17,
      endTime: 18,
    },
    {
      startTime: 18,
      endTime: 19,
    },
    {
      startTime: 19,
      endTime: 20,
    },
  ];

  // const startTime = 7;
  // const endTime = 21;

  // const times = Array.from(
  //   { length: endTime - startTime },
  //   (_, i) => `${startTime + i}:00`
  // );

  const toggleShow = () => {
    if (choosenCells.length !== 0) {
      setShow(!show);
    } else {
      toastMessage("Please choose a timeslot");
    }
  };

  const setTd = (value) => {
    try {
      const updatedScheduleData = { ...scheduleData };

      choosenCells.forEach(async (cell) => {
        const { time, day, fullDay } = JSON.parse(cell);

        const matchingSchedules = schedules.filter(
          (schedule) =>
            schedule.day === day &&
            schedule.time.startTime === time.startTime &&
            schedule.time.endTime === time.endTime
        );

        if (matchingSchedules.length > 0) {
          matchingSchedules.forEach(async (matchingSchedule) => {
            console.log("Deleted", matchingSchedule.id);
            await handleDeleteSchedulesDoc(matchingSchedule.id);
          });
        }

        updatedScheduleData[`${time.startTime}-${time.endTime}-${day}`] = value;
        await db.setInstructorSchedule(
          fullDay,
          time,
          updatedScheduleData[`${time.startTime}-${time.endTime}-${day}`]
        );
        console.log(`${time.startTime}-${time.endTime}-${day}`);
      });

      setChoosenCells([]);
      setIsEditMode(false);
    } catch (error) {
      toastMessage("Error in setting table data", error.message);
    }
  };

  const handleChooseCells = () => {
    try {
      setIsEditMode(!isEditMode);
      setChoosenCells([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCellClick = (time, day) => {
    if (isEditMode) {
      const cellData = { time, day: day.dayOfWeek, fullDay: day };
      const JsonFormat = JSON.stringify(cellData);
      console.log(JsonFormat);
      setChoosenCells((prev) =>
        prev.includes(JsonFormat)
          ? prev.filter((cell) => cell !== JsonFormat)
          : [...prev, JsonFormat]
      );
    }
  };

  const handleDeleteSchedulesDoc = async (id) => {
    try {
      await db.deleteSchedule(id);
    } catch (error) {
      toastMessage("Error in updating schedule", error.message);
    }
  };

  useEffect(() => {
    const handleGetDays = async () => {
      try {
        const dayOfWeek = await db.getDays();
        setSchedules(dayOfWeek);
      } catch (error) {
        toastMessage(error.message);
      }
    };
    handleGetDays();
  }, []);

  const handleGetTimeSlots = async (day) => {
    try {
      const timeSlot = await db.getTimeslotsForDay(day);
    } catch (error) {
      toastMessage("Error in retreivng timeslots", error.message);
    }
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const unsubscribeSchedules = db.subscribeToSchedulesChanges(
          async (schedules) => {
            const unsubscribeTimeslotCallbacks = [];

            const newScheduleData = {};

            schedules.forEach((schedule) => {
              const unsubscribeTimeslot = db.subscribeToTimeslotChanges(
                (timeslots) => {
                  timeslots.forEach((timeslot) => {
                    const key = `${timeslot.time.startTime}-${timeslot.time.endTime}-${schedule.dayOfWeek}`;
                    newScheduleData[key] = timeslot.assignedInstructor;
                  });
                  setScheduleData({ ...scheduleData, ...newScheduleData });
                },
                schedule
              );

              unsubscribeTimeslotCallbacks.push(unsubscribeTimeslot);
            });

            return () => {
              unsubscribeSchedules();
              unsubscribeTimeslotCallbacks.forEach((unsubscribe) =>
                unsubscribe()
              );
            };
          }
        );
      } catch (error) {
        toastMessage("Error fetching schedules: " + error.message);
      }
    };

    fetchSchedules();
  }, [db]);

  return (
    <div className="admin-schedules-page-container">
      <h3>College of Computer Studies</h3>
      <h4>Faculty Consultation Schedule</h4>
      <div className="schedules-table">
        <table>
          <thead>
            <tr>
              <th>Time/Days</th>
              {schedules && schedules.length !== 0
                ? schedules.map((day) => <th key={day.id}>{day.dayOfWeek}</th>)
                : ""}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={`${time.startTime}-${time.endTime}`}>
                <td>{`${time.startTime}:00 ${time.endTime}:00`} </td>
                {schedules && schedules.length !== 0
                  ? schedules.map((day) => (
                      <td
                        key={`${time.startTime}-${time.endTime}-${day.dayOfWeek}`}
                        onClick={() => handleCellClick(time, day)}
                        className={
                          isEditMode &&
                          choosenCells.some((cell) => {
                            const parsedCell = JSON.parse(cell);
                            return (
                              parsedCell.time.startTime === time.startTime &&
                              parsedCell.time.endTime === time.endTime &&
                              parsedCell.day === day.dayOfWeek
                            );
                          })
                            ? "clickable-cell selected-cell"
                            : isEditMode
                            ? "clickable-cell"
                            : ""
                        }
                      >
                        {scheduleData[
                          `${time.startTime}-${time.endTime}-${day.dayOfWeek}`
                        ]?.firstName || ""}
                      </td>
                    ))
                  : ""}
              </tr>
            ))}
          </tbody>
        </table>
        {show && (
          <SchedulesModal
            toggleShow={toggleShow}
            show={show}
            selectedTime={selectedTime}
            teachersList={teachersList}
            toastMessage={toastMessage}
            setTd={setTd}
          />
        )}
        {!isEditMode ? (
          <button onClick={handleChooseCells}>Edit</button>
        ) : (
          <div>
            <button onClick={() => toggleShow()}>Select</button>
            <button onClick={() => handleChooseCells()}>Cancel</button>
          </div>
        )}
      </div>
      <div className="legends-container">
        <h5>Legend</h5>
        {teachersList && teachersList.length !== 0 ? (
          teachersList.map((teacher, index) => (
            <div key={index} className="teacher-legend">
              <p>
                {teacher.firstName} {teacher.lastName}
              </p>
            </div>
          ))
        ) : (
          <p>No Instructors</p>
        )}
      </div>
    </div>
  );
};

export default AdminSchedulesPage;
