
import BarGraph from "./BarGraph";
import TodayInfo from "./TodayInfo";

const TotalAppointments = ({apptList, exportButton}) => {
  
  
  return (
    <div className="flex w-full flex-col gap-5 ">
      <div className="seven-day-graph w-full">
        <BarGraph apptList={apptList} exportButton={exportButton} />
      </div>
      <div className="today-info w-full">
        <TodayInfo apptList={apptList} />
      </div>
    </div>
  );
};

export default TotalAppointments;
