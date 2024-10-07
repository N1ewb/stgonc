import { useCallback } from "react";
import toast from "react-hot-toast";

const DeleteSchedulesDoc = async (value, day, deletedCells, db) => {
    const toastMessage = (message) => toast(message)
  try {
    var error = false;
    await db.deleteSchedule(value.timeslot.id, day.id);
    const key = `${value.timeslot.time.startTime}-${value.timeslot.time.endTime}-${day.dayOfWeek}`;
    const delCells = deletedCells.current.add(key);
    var setScheduleData = () => {};
    setScheduleData = (prevData) => {
      const newData = { ...prevData };
      delete newData[key];
      return newData;
    } ;
    var values = {
        setScheduleData,
        delCells
    }
  } catch (error) {
    error = true;
    toastMessage("Error in deleting schedule ...");
  } finally {
    if (!error) {
      return values
    }
  }
};

export default DeleteSchedulesDoc;
