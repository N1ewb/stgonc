import { useCallback, useRef, useState } from "react";

export const useScheduleManagement = (toastMessage, teachersList, db, queryFunction) => {
  const [scheduleData, setScheduleData] = useState({});
  const deletedCells = useRef(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDeleteSchedulesDoc = useCallback(
    async (value, day) => {
      try {
        setError(false);
        await db.deleteSchedule(value.timeslot.id, day.id);
        const key = `${value.timeslot.time.startTime}-${value.timeslot.time.endTime}-${day.dayOfWeek}`;
        deletedCells.current.add(key);
        setScheduleData((prevData) => {
          const newData = { ...prevData };
          delete newData[key];
          return newData;
        });
        toastMessage("Deleted Successfully");
      } catch (error) {
        setError(true);
        toastMessage("Error in deleting schedule...");
      }
    },
    [db, toastMessage]
  );

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const unsubscribeSchedules = db.subscribeToSchedulesChanges(async (schedules) => {
        const newScheduleData = {};
  
        const unsubscribeTimeslotCallbacks = schedules.map((schedule) => {
          return queryFunction((timeslots) => {
            timeslots.forEach((timeslot) => {
              const key = `${timeslot.time.startTime}-${timeslot.time.endTime}-${schedule.dayOfWeek}`;
              if (!deletedCells.current.has(key)) {
                const foundInstructor = teachersList.find(
                  (instructor) => instructor.userID === timeslot.assignedInstructor.userID
                );
                console.log(foundInstructor)
                newScheduleData[key] = { foundInstructor, timeslot };
              }
            });
          }, schedule);
        });
  
        // Ensure state is only updated once after processing all schedules
        setScheduleData((prevData) => {
          const updatedData = { ...prevData, ...newScheduleData };
          deletedCells.current.forEach((key) => {
            delete updatedData[key];
          });
          return updatedData;
        });
  
        return () => {
          unsubscribeTimeslotCallbacks.forEach((unsubscribe) => unsubscribe());
        };
      });
  
      return () => unsubscribeSchedules();
    } catch (error) {
      toastMessage("Error fetching schedules: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [db, toastMessage, teachersList]);
  

  return {
    scheduleData,
    deletedCells,
    loading,
    error,
    handleDeleteSchedulesDoc,
    fetchSchedules,
  };
};
