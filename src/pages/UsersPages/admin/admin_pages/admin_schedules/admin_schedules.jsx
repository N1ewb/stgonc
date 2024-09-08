import React, { useEffect, useState } from "react";
import "./admin_schedules.css";
import SchedulesModal from "../../../../../components/modal/schedules-modal/SchedulesModal";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";

const AdminSchedulesPage = () => {
  const db = useDB();
  const toastMessage = (message) => toast(message);
  const { currentUser } = useAuth();
  const [teachersList, setTeachersList] = useState([]);
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

  useEffect(() => {
    const handleGetTechears = async () => {
      const teachers = await db.getTeachers();
      setTeachersList(teachers);
    };
    handleGetTechears();
  }, []);

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
    <div className="admin-schedules-page-container w-full h-[100%] flex flex-col justify-around items-center gap-[5px]">
      <div className="admin-schedule-header flex flex-col w-full text-center text-[#740000]">
        <h1 className="w-[full] font-bold text-3xl">
          {currentUser.department}
        </h1>
        <h3 className="w-full text-xl">Faculty Consultation Schedule</h3>
      </div>
      <div className="schedules-table w-full md:w-[90%] mt-[20px] flex flex-col items-center justify-between gap-[5px] ">
        <table className=" min-w-[50%] border-collapse border-solid border-[1px] border-[#740000] text-center">
          <thead>
            <tr className="even:bg-[#740000] [&_th]:border-solid [&_th]:border-[1px] [&_th]:border-[#740000] [&_th]:font-bold [&_th]:bg-[#740000] [&_th]:text-white [&_th]:p-[8px] [&_th]:w-[100px] xsm:w-[80px]">
              <th className="xsm:text-[14px]">Time/Days</th>
              {schedules && schedules.length !== 0
                ? schedules.map((day) => (
                    <th className="xsm:text-[13px]" key={day.id}>
                      <span className="block md:hidden">{day.dayOfWeek}</span>
                      <span className="hidden md:block">{day.shortVer}</span>
                    </th>
                  ))
                : ""}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={`${time.startTime}-${time.endTime}`}>
                <td className="h-[30px] xsm:text-[14px] first:bg-[#740000] text-white border-solid border-[1px] border-[#740000]">
                  {`${time.startTime}:00 ${time.endTime}:00`}{" "}
                </td>
                {schedules && schedules.length !== 0
                  ? schedules.map((day) => (
                      <td
                        style={{
                          backgroundColor:
                            scheduleData[
                              `${time.startTime}-${time.endTime}-${day.dayOfWeek}`
                            ]?.instructorColorCode || "",
                        }}
                        key={`${time.startTime}-${time.endTime}-${day.dayOfWeek}`}
                        onClick={() => handleCellClick(time, day)}
                        className={`border-solid border-[1px] border-[#740000] ${
                          isEditMode &&
                          choosenCells.some((cell) => {
                            const parsedCell = JSON.parse(cell);
                            return (
                              parsedCell.time.startTime === time.startTime &&
                              parsedCell.time.endTime === time.endTime &&
                              parsedCell.day === day.dayOfWeek
                            );
                          })
                            ? `bg-[#571010]`
                            : isEditMode
                            ? "bg-[#fca4a4] cursor-pointer hover:bg-[#5f1b24]"
                            : ""
                        }`}
                      ></td>
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
          <button
            className="bg-[#740000] w-[200px] rounded-[4px] hover:bg-[#641b1b]"
            onClick={handleChooseCells}
          >
            Edit
          </button>
        ) : (
          <div className="flex flex-row w-[250px] justify-around [&_button]:bg-[#740000] [&_button]:w-[100px] [&_button]:rounded-[4px]">
            <button onClick={() => toggleShow()}>Select</button>
            <button onClick={() => handleChooseCells()}>Cancel</button>
          </div>
        )}
      </div>
      <div className="legends-container w-full flex flex-col justify-around">
        <h5 className="text-2xl font-bold text-[#740000]">Legend</h5>
        <div className="instructors-legend w-full flex flex-row flex-wrap gap-6">
          {teachersList && teachersList.length !== 0 ? (
            teachersList.map((teacher, index) => (
              <div
                key={index}
                className="teacher-legend flex flex-row items-center gap-2 w-[100px] "
              >
                <p className="m-0 ">{teacher.lastName}</p>
                <div
                  style={{
                    backgroundColor: `${
                      teacher.instructorColorCode
                        ? teacher.instructorColorCode
                        : "gray"
                    }`,
                  }}
                  className={`instructorColorCode p-2`}
                ></div>
              </div>
            ))
          ) : (
            <p>No Instructors</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSchedulesPage;
