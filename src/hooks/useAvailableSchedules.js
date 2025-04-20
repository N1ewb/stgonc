import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useDB } from "../context/db/DBContext";

const useAvailableSchedules = (instructor, appointmentDate) => {
  const db = useDB();
  const [instructorSchedule, setInstructorSchedule] = useState([]);
  const [instructorTimeslots, setInstructorTimeslots] = useState([]);
  const [bookedTimeslots, setBookedTimeslots] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);

  const toastMessage = (message) => toast(message);

  const handleSetAvailableSchedule = async () => {
    if (instructorSchedule.length && allAppointments.length) {
      const appointmentDatematch = allAppointments.filter(
        (appt) => appt.appointmentDate === appointmentDate.dateWithoutTime
      );

      if (appointmentDatematch.length) {
        const matchingTimeslots = allAppointments.filter(
          (appointment) =>
            instructorTimeslots.some((timeslot) =>
              appointment.appointmentsTime.appointmentStartTime.includes(
                timeslot.time.startTime.toString()
              )
            ) && appointment.appointmentStatus === "Accepted"
        );

        if (matchingTimeslots.length) {
          const bookedSlots = matchingTimeslots.map((match) => ({
            Day: match.appointmentDate,
            startTime: match.appointmentsTime.appointmentStartTime,
            endTime: match.appointmentsTime.appointmentEndTime,
          }));
          setBookedTimeslots(bookedSlots);
        }
      }
    } else {
      toastMessage("Instructor schedule or timeslots are missing.");
    }
  };

  useEffect(() => {
    const fetchAllAppointments = async () => {
      const appointments = await db.getInstructorAppointment(instructor.id);
      const filteredAppointments = appointments.filter(
        (appt) => appt.appointedFaculty === instructor.id
      );

      const followupPromises = filteredAppointments.map(async (appointment) => {
        const followupRef = collection(
          db.appointmentsRef,
          appointment.id,
          "Followup"
        );
        const followupSnapshot = await getDocs(
          query(followupRef, where("appointmentStatus", "==", "Followup"))
        );
        const followups = followupSnapshot.docs.map((followupDoc) => ({
          id: followupDoc.id,
          ...followupDoc.data(),
        }));

        return {
          ...appointment,
          followups,
        };
      });

      const appointmentsWithFollowups = await Promise.all(followupPromises);
      setAllAppointments(appointmentsWithFollowups);
    };

    if (instructor && appointmentDate) {
      fetchAllAppointments();
    }
  }, [instructor, appointmentDate, db]);

  useEffect(() => {
    if (appointmentDate && instructorTimeslots.length) {
      handleSetAvailableSchedule();
    }
  }, [appointmentDate, instructorTimeslots]);

  const handleGetInstructorTimeSlots = async (day) => {
    try {
      const scheduleDay = await db.getScheduleDay(day.dayOfWeek);
      const timeslots = await db.getInstructorTimeslots(
        scheduleDay[0],
        instructor.email
      );
      setInstructorTimeslots(timeslots);
    } catch (error) {
      toastMessage(
        "Error in retrieving instructor timeslots: " + error.message
      );
    }
  };

  const handleGetInstructorAvailableDays = async (days) => {
    try {
      if (days.length) {
        const availableDays = [];
        console.log("Ins Email", instructor.email);
        for (const day of days) {
          const timeslots = await db.getInstructorTimeslots(
            day,
            instructor.email
          );
          if (timeslots.length) {
            availableDays.push(day.dayOfWeek);
          }
        }
        setInstructorSchedule(availableDays);
      }
    } catch (error) {
      toastMessage(
        "Error in retrieving instructor available dates: " + error.message
      );
    }
  };

  return {
    instructorSchedule,
    instructorTimeslots,
    bookedTimeslots,
    handleGetInstructorTimeSlots,
    handleGetInstructorAvailableDays,
  };
};

export default useAvailableSchedules;
