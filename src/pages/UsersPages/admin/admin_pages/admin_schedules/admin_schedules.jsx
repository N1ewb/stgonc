import React, { useEffect, useRef, useState } from "react";
import "./admin_schedules.css";

import toast from "react-hot-toast";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";
import Legends from "../../admin-components/Legends";
import ExportToPDFHOC from "../../../../../ComponentToPDF/ExportHOC";
import { auth } from "../../../../../server/firebase";
import Export from "../../../../../static/images/export-file.png";
import Edit from "../../../../../static/images/pen.png";
import { Tooltip } from "react-tooltip";
import SchedulesTable from "../../admin-components/SchedulesTable";

const AdminSchedulesPage = () => {
  const db = useDB();
  const toastMessage = (message) => toast(message);
  const { currentUser } = useAuth();
  const [teachersList, setTeachersList] = useState([]);
  const [show, setShow] = useState(false);

  const [scheduleData, setScheduleData] = useState({});
  const [schedules, setSchedules] = useState();
  const [choosenCells, setChoosenCells] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const exportPDFRef = useRef();

  const handleExport = () => {
    if (exportPDFRef.current) {
      exportPDFRef.current.exportPDF();
    }
  };

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
    const fetchInstructors = async () => {
      try {
        const handleInstructorUpdates = (instrcutorData) => {
          setTeachersList(instrcutorData);
        };

        const unsubscribe = db.subscribeToInstructorChanges(
          handleInstructorUpdates
        );

        return () => unsubscribe();
      } catch (error) {
        toastMessage("Error in fetching instructors:", error.message);
      }
    };

    fetchInstructors();
  }, [db]);

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
    <ExportToPDFHOC
      fileName={`${auth.currentUser.displayName} Faculty schedule`}
      ref={exportPDFRef}
    >
      <div className="admin-schedules-page-container w-full h-[100%] flex flex-col justify-around items-center gap-[5px]">
        <div className="admin-schedule-header flex flex-col w-full text-center text-[#740000]">
          <h1 className="w-[full] font-bold text-3xl">
            {currentUser.department}
          </h1>
          <h3 className="w-full text-2xl font-bold">
            Faculty Consultation Schedule
          </h3>
        </div>
        <div className="pt-20">
          <div className="actions-container w-full flex flex-row-reverse gap-3">
            <button
              onClick={handleExport}
              className="export-button bg-transparent  p-0"
            >
              <img src={Export} alt="Export" height={27} width={27} />
            </button>
            {!isEditMode ? (
              <button
                className="edit-button bg-transparent  p-0"
                onClick={handleChooseCells}
              >
                <img src={Edit} alt="Edit" height={25} width={25} />
              </button>
            ) : (
              <div className="flex flex-row w-[250px] justify-around [&_button]:bg-[#740000] [&_button]:w-[100px] [&_button]:rounded-[4px]">
                <button onClick={() => toggleShow()}>Select</button>
                <button onClick={() => handleChooseCells()}>Cancel</button>
              </div>
            )}
          </div>
          <div className="div flex flex-row-reverse flex-wrap w-full justify-evenly">
            <SchedulesTable
              show={show}
              teachersList={teachersList}
              setTd={setTd}
              toggleShow={toggleShow}
              toastMessage={toastMessage}
              schedules={schedules}
              isEditMode={isEditMode}
              scheduleData={scheduleData}
              choosenCells={choosenCells}
              setChoosenCells={setChoosenCells}
            />

            <div className="legends-container relative basis-[20%] md:basis-[90%] flex flex-col justify-start gap-3">
              <h5 className="text-2xl font-bold text-[#740000]">Legend</h5>
              {teachersList && teachersList.length !== 0 ? (
                teachersList.map((teacher, index) => (
                  <Legends key={index} teacher={teacher} />
                ))
              ) : (
                <p>No Instructors</p>
              )}
            </div>
          </div>
        </div>
        <Tooltip anchorSelect=".export-button" place="top">
          Export file to PNG
        </Tooltip>
        <Tooltip anchorSelect=".edit-button" place="top">
          Edit Table
        </Tooltip>
      </div>
    </ExportToPDFHOC>
  );
};

export default AdminSchedulesPage;
