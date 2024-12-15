import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useDB } from "../context/db/DBContext";
import { useAuth } from "../context/auth/AuthContext";
import { useReschedDialog } from "../context/appointmentContext/ReschedContext";

const useScheduleAppointment = (isFormOpen) => {
  const db = useDB();
  const auth = useAuth();
  const { reschedappointment } = useReschedDialog()
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
    if(reschedappointment){
      console.log(reschedappointment)
    }
  },[])
  useEffect(() => {
    const fetchAvailableDays = async () => {
      try {
        setInstructorSchedule([]);
        if (isFormOpen) {
          const days = await db.getDays();
          setAvailableDays(days);
          fetchInstructorAvailableDays(days);
        }
      } catch (error) {
        toastMessage(`Error retrieving days: ${error.message}`);
      }
    };

    if (isFormOpen) fetchAvailableDays();
  }, [isFormOpen, db]);

  useEffect(() => {
    if (appointmentDate && auth.currentUser) {
      fetchInstructorTimeslots(appointmentDate);
    } else {
      setInstructorTimeslots([]);
    }
  }, [appointmentDate, auth.currentUser]);

  const fetchInstructorAvailableDays = async (days) => {
    try {
      const useEmail = reschedappointment.email || auth.currentUser.email
      const availableDays = [];
      for (const day of days) {
        const timeslots = await db.getInstructorTimeslots(
          day,
          useEmail
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
      const useEmail = reschedappointment.email || auth.currentUser.email
      const scheduleDay = await db.getScheduleDay(day.dayOfWeek);
      const timeslots = await db.getInstructorTimeslots(
        scheduleDay[0],
        useEmail
      );
      setInstructorTimeslots(timeslots);
    } catch (error) {
      toastMessage(`Error retrieving instructor timeslots: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isFormOpen) {
      const fetchAppointments = async () => {
        try {
          const useID = reschedappointment.userID || auth.currentUser.uid
          const appointments = await db.getInstructorAppointment(
            useID
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
  }, [isFormOpen, auth.currentUser, db]);

  const setAvailableSchedule = () => {
    if (instructorSchedule && allAppointments) {
      const appointmentDatematch = allAppointments.filter(
        (appt) => appt.appointmentDate === appointmentDate.dateWithoutTime
      );

      if (appointmentDatematch.length !== 0) {
        const matchingTimeslots = appointmentDatematch.filter((appointment) => {
          const { appointmentsTime } = appointment;

          if (appointmentsTime && typeof appointmentsTime === "object") {
            return (
              instructorTimeslots.some((timeslot) =>
                appointmentsTime.appointmentStartTime.includes(
                  timeslot.time.startTime.toString()
                )
              ) &&
              (appointment.appointmentStatus === "Accepted" ||
                appointment.appointmentStatus === "Followup")
            );
          } else {
            console.warn(
              "appointmentsTime is undefined or not an object for appointment:",
              appointment
            );
            return false;
          }
        });

        if (matchingTimeslots.length > 0) {
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

export default useScheduleAppointment;
