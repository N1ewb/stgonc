import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useDB } from "../context/db/DBContext";
import { useAuth } from "../context/auth/AuthContext";

const useFollowupAppointment = (isFollowupFormOpen) => {
  const db = useDB();
  const auth = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [instructorSchedule, setInstructorSchedule] = useState([]);
  const [instructorTimeslots, setInstructorTimeslots] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [bookedTimeslots, setBookedTimeslots] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);

  const toastMessage = (message) => toast(message);

  useEffect(() => {
    const fetchAvailableDays = async () => {
      try {
        setInstructorSchedule([]);
        if (isFollowupFormOpen) {
          const days = await db.getDays();
          setAvailableDays(days);
          fetchInstructorAvailableDays(days);
        }
      } catch (error) {
        toastMessage(`Error retrieving days: ${error.message}`);
      }
    };

    if (isFollowupFormOpen) fetchAvailableDays();
  }, [isFollowupFormOpen, db]);

  useEffect(() => {
    if (appointmentDate && auth.currentUser) {
      fetchInstructorTimeslots(appointmentDate);
    } else {
      setInstructorTimeslots([]);
    }
  }, [appointmentDate, auth.currentUser]);

  const fetchInstructorAvailableDays = async (days) => {
    try {
      const availableDays = [];
      for (const day of days) {
        const timeslots = await db.getInstructorTimeslots(
          day,
          auth.currentUser.email
        );
        if (timeslots.length > 0) {
          availableDays.push(day.dayOfWeek);
        }
      }
      setInstructorSchedule(availableDays);
    } catch (error) {
      toastMessage(
        `Error retrieving instructor available dates: ${error.message}`
      );
    }
  };

  const fetchInstructorTimeslots = async (day) => {
    try {
      const scheduleDay = await db.getScheduleDay(day.dayOfWeek);
      const timeslots = await db.getInstructorTimeslots(
        scheduleDay[0],
        auth.currentUser.email
      );
      setInstructorTimeslots(timeslots);
    } catch (error) {
      toastMessage(`Error retrieving instructor timeslots: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isFollowupFormOpen) {
      const fetchAppointments = async () => {
        try {
          const appointments = await db.getInstructorAppointment(
            auth.currentUser.uid
          );
          const filteredAppointments = appointments.filter(
            (appt) => appt.appointedFaculty === auth.currentUser.uid
          );
          setAllAppointments(filteredAppointments);
        } catch (error) {
          toastMessage(`Error retrieving appointments: ${error.message}`);
        }
      };
      fetchAppointments();
    }
  }, [isFollowupFormOpen, auth.currentUser, db]);

  const setAvailableSchedule = () => {
    if (
      instructorSchedule.length &&
      allAppointments.length &&
      appointmentDate
    ) {
      const appointmentsOnDate = allAppointments.filter(
        (appt) => appt.appointmentDate === appointmentDate.dateWithoutTime
      );

      if (appointmentsOnDate.length > 0) {
        const bookedSlots = appointmentsOnDate
          .filter((appt) =>
            instructorTimeslots.some((slot) =>
              appt.appointmentsTime.appointmentStartTime.includes(
                slot.time.startTime.toString()
              )
            )
          )
          .map((match) => ({
            day: match.appointmentDate,
            startTime: match.appointmentsTime.appointmentStartTime,
            endTime: match.appointmentsTime.appointmentEndTime,
          }));
        setBookedTimeslots(bookedSlots);
      }
    } else {
      toastMessage("Instructor schedule or timeslots are missing.");
    }
  };

  useEffect(() => {
    if (appointmentDate && instructorTimeslots.length) {
      setAvailableSchedule();
    }
  }, [appointmentDate, instructorTimeslots]);

  useEffect(() => {
    if (!selectedDate) {
      setInstructorTimeslots([]);
    }
  }, [selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    instructorSchedule,
    instructorTimeslots,
    appointmentDate,
    setAppointmentDate,
    appointmentTime,
    setAppointmentTime,
    bookedTimeslots,
    allAppointments,
    availableDays,
  };
};

export default useFollowupAppointment;
