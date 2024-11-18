import AppointmentRecordCard from "./AppointmentRecordCard";
import AppointmentRecordFollowupCard from "./AppointmentRecordFollowupCard";

export default function AppointmentRecord({ appt }) {
  return (
    <div className="h-full w-full flex flex-col gap-4 p-10">
      <div className="main">
        <p>Main Consultation</p>
        <AppointmentRecordCard appt={appt} />
      </div>
      <p>Followup Consultations</p>
      <div className="followups w-full flex flex-row flex-wrap gap-3 ">
       
        {appt.followup.length !== 0
          ? appt.followup.map((followup, index) => {
              return <AppointmentRecordFollowupCard key={index} appt={followup} />;
            })
          : "No followup"}
      </div>
    </div>
  );
}
