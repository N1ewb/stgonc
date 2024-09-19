import React, { useEffect, useState } from "react";
import SchedulesModal from "../../../../components/modal/schedules-modal/SchedulesModal";
import { useDB } from "../../../../context/db/DBContext";

const SchedulesTable = ({
  show,
  schedules,
  toggleShow,
  teachersList,
  toastMessage,
  setSchedules,
  choosenCells,
  setChoosenCells,
  isEditMode,
  setIsEditMode,
}) => {
  const db = useDB();
  const [scheduleData, setScheduleData] = useState({});

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

  // const handleGetTimeSlots = async (day) => {
  //   try {
  //     const timeSlot = await db.getTimeslotsForDay(day);
  //   } catch (error) {
  //     toastMessage("Error in retreivng timeslots", error.message);
  //   }
  // };

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

                    const foundInstructor = teachersList.find(
                      (instructor) =>
                        instructor.userID === timeslot.assignedInstructor.userID
                    );

                    newScheduleData[key] = foundInstructor;
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
  }, [db, teachersList]);

  return (
    <div className="schedules-table basis-[80%]  md:basis-[90%]  flex flex-col items-center justify-between shadow-md gap-3 p-10 rounded-[30px]">
      <table className=" min-w-[50%] border-collapse  text-center">
        <thead>
          <tr className="  [&_th]:border-transparent [&_th]:font-bold [&_th]:text-[#720000] [&_th]:p-[8px] [&_th]:w-[100px] xsm:w-[80px]">
            <th className="xsm:text-[14px] ">Time/Days</th>
            {schedules && schedules.length !== 0
              ? schedules.map((day) => (
                  <th className="xsm:text-[13px]" key={day.id}>
                    <span className="block md:hidden ">{day.dayOfWeek}</span>
                    <span className="hidden md:block">{day.shortVer}</span>
                  </th>
                ))
              : ""}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={`${time.startTime}-${time.endTime}`}>
              <td className="h-[30px] xsm:text-[14px] ">
                {`${time.startTime}:00 ${time.endTime}:00`}
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
                      className={`border-solid border-[1px] border-[#e4e4e4] ${
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
          teachersList={teachersList}
          toastMessage={toastMessage}
          setTd={setTd}
        />
      )}
    </div>
  );
};

export default SchedulesTable;
