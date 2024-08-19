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

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const startTime = 7;
  const endTime = 20;

  const times = Array.from(
    { length: endTime - startTime },
    (_, i) => `${startTime + i}:00`
  );

  const toggleShow = () => {
    setShow(!show);
  };

  const setTd = (value) => {
    try {
      const updatedScheduleData = { ...scheduleData };

      choosenCells.forEach(async (cell) => {
        const JsonFormat = JSON.parse(cell);

        //DI MO GANA
        const matchingSchedules = schedules.filter(
          (schedule) =>
            schedule.day === JsonFormat.day && schedule.time === JsonFormat.time
        );

        if (matchingSchedules) {
          matchingSchedules.forEach(async (matchingSchedule) => {
            console.log("Deleted", matchingSchedule.id);
            await handleDeleteSchedulesDoc(matchingSchedule.id);
          });
        }
        ////////////////

        updatedScheduleData[`${JsonFormat.time}-${JsonFormat.day}`] = value;
        await db.setInstructorSchedule(
          JsonFormat.day,
          JsonFormat.time,
          updatedScheduleData[`${JsonFormat.time}-${JsonFormat.day}`]
        );
        console.log(`${JsonFormat.time}-${JsonFormat.day}`);
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
      const selectedCell = `${time}-${day}`;

      const JsonFormat = JSON.stringify({ time, day });
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
    const handleGetSchedules = async () => {
      try {
        const schedule = await db.getSchedules();
        setSchedules(schedule);
      } catch (error) {
        toastMessage(error.message);
      }
    };
    handleGetSchedules();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const unsubscribe = db.subscribeToSchedulesChanges((schedules) => {
          const newScheduleData = {};

          schedules.forEach((schedule) => {
            const key = `${schedule.time}-${schedule.day}`;
            newScheduleData[key] = schedule.assignedInstructor;
          });

          setScheduleData(newScheduleData);
        });

        return () => unsubscribe();
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
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time}>
                <td>{time}</td>
                {daysOfWeek.map((day) => (
                  <td
                    key={`${time}-${day}`}
                    onClick={() => handleCellClick(time, day)}
                    className={
                      isEditMode &&
                      choosenCells.includes(JSON.stringify({ time, day }))
                        ? "clickable-cell selected-cell"
                        : isEditMode
                        ? "clickable-cell"
                        : ""
                    }
                  >
                    {scheduleData[`${time}-${day}`]?.firstName || ""}
                  </td>
                ))}
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
