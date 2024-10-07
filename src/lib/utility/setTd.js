import toast from "react-hot-toast";


const SetTD = (value, scheduleData, choosenCells, db) => {
    const toastMessage = (message) => toast(message)
    try {
      const updatedScheduleData = { ...scheduleData };

      choosenCells.forEach(async (cell) => {
        const { time, day, fullDay } = JSON.parse(cell);

        updatedScheduleData[`${time.startTime}-${time.endTime}-${day}`] = value;
        await db.setInstructorSchedule(
          fullDay,
          time,
          updatedScheduleData[`${time.startTime}-${time.endTime}-${day}`]
        );
        console.log(`${time.startTime}-${time.endTime}-${day}`);
      });
      
      const values = {
        choosedCells: [],
        editMode: false,
        notifSent: true
      }
      return values
    } catch (error) {
      toastMessage("Error in setting table data", error.message);
    }
  };

  export default SetTD