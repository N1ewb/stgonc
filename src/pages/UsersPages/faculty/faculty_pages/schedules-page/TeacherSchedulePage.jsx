import React, { useEffect, useState } from "react";
import SchedulesPageCalendar from "../../faculty_components/SchedulePageCalendar";
import { useDB } from "../../../../../context/db/DBContext";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../context/auth/AuthContext";
import FacultyTimeslots from "../../faculty_components/FacultyTimeslots";
import Loading from "../../../../../components/Loading/Loading";

const TeacherSchedulePage = () => {
  const db = useDB();
  const auth = useAuth();
  const [instructorSchedule, setInstructorSchedule] = useState([]);
  const [instructorTimeslots, setInstructorTimeslots] = useState([]);
  const toastMessage = (message) => toast(message);

  const handleGetAllInstructorTimeSlots = async (days, email) => {
    try {
      const promises = days.map(async (day) => {
        const timeslots = await db.getInstructorTimeslots(day, email);
        return { day: day.dayOfWeek, timeslots };
      });
      const allTimeslots = await Promise.all(promises);
      setInstructorTimeslots(allTimeslots);
    } catch (error) {
      toastMessage(
        `Error in retrieving instructor time slots: ${error.message}`
      );
    }
  };

  const handleGetInstructorAvailableDays = async (days, email) => {
    try {
      if (days && days.length !== 0) {
        const availableDays = [];

        for (const day of days) {
          const timeslots = await db.getInstructorTimeslots(day, email);

          if (timeslots && timeslots.length !== 0) {
            availableDays.push(day.dayOfWeek);
          }
        }
        setInstructorSchedule(availableDays);
      }
    } catch (error) {
      toastMessage(
        `Error in retrieving instructor available dates: ${error.message}`
      );
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      const handleGetDays = async () => {
        try {
          setInstructorSchedule([]);

          const dayOfWeek = await db.getDays();

          handleGetInstructorAvailableDays(dayOfWeek, auth.currentUser.email);
          handleGetAllInstructorTimeSlots(dayOfWeek, auth.currentUser.email);
        } catch (error) {
          toastMessage(`Error in retrieving days: ${error.message}`);
        }
      };
      handleGetDays();
    }
  }, [auth.currentUser]);

  return (
    <div className="schedules-page-container w-full h-[100%]">
      <h1 className="text-[#320000]">
        <span className="font-bold">Consultation</span> <br /> Schedules
      </h1>
      <div className="schedules-page-main-content h-[80%] flex flex-row gap-10 items-center">
        <div className="schedules-calendar w-[48%]">
          <SchedulesPageCalendar instructorSchedule={instructorSchedule} />
        </div>
        <div className="timeslot-list w-[30%] text-[#320000] flex flex-col">
          <div className="flex flex-col py-4 px-6 bg-white rounded-[30px] shadow-lg">
            <h2 className="font-bold">Consultation Hours</h2>
            <div className="flex flex-col flex-wrap w-full gap-3">
              {instructorTimeslots && instructorTimeslots.length !== 0 ? (
                instructorTimeslots.map(
                  (timeslots, index) =>
                    timeslots.timeslots.length > 0 && (
                      <FacultyTimeslots key={index} timeslots={timeslots} />
                    )
                )
              ) : (
                <div className="h-[40vh] flex flex-col items-start">
                  <Loading />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedulePage;
