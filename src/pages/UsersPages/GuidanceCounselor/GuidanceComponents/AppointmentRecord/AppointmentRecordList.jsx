import AppointmentRecord from "./AppointmentRecord";

export default function AppointmentRecordList({ appointmentRecord }) {
  return (
    <div className=" w-full h-[90%] flex justify-between">
      <div className="w-1/2 max-h-[90%] overflow-auto">
        {appointmentRecord.length !== 0
          ? appointmentRecord.map((appt,index) => {
              return <AppointmentRecord key={index} appt={appt} />
            })
          : "No Appointment Record"}
      </div>
      <div className="w-[47%] h-[90%] flex justify-center items-center"></div>
    </div>
  );
}
