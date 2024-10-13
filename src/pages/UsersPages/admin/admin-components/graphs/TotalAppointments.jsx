
import BarGraph from "./BarGraph";
import TodayInfo from "./TodayInfo";

const TotalAppointments = ({apptList}) => {
  
  
  return (
    <div className="flex w-full flex-col gap-5 ">
      <div className="seven-day-graph w-full">
        <BarGraph apptList={apptList} />
      </div>
      <div className="today-info w-full">
        <TodayInfo apptList={apptList} />
      </div>
    </div>
  );
};

export default TotalAppointments;
