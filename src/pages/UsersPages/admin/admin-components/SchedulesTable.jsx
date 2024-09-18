import React from "react";
import SchedulesModal from "../../../../components/modal/schedules-modal/SchedulesModal";

const SchedulesTable = ({show, schedules, isEditMode, toggleShow, teachersList, setTd, toastMessage, scheduleData, setChoosenCells,choosenCells}) => {
  
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
