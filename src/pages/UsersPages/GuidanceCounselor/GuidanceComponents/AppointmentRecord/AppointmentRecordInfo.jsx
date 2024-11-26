export default function AppointmentRecordInfo({
  currentRecord,
  setCurrentRecord,
}) {
  return (
    <div className="shadow-md w-full rounded-3xl p-10 ">
      <header className="flex w-full justify-between">
        <h1 className="text-2xl">Consultation Info</h1>
        <button
          className="bg-[#720000] hover:bg-[#320000]"
          onClick={() => setCurrentRecord(null)}
        >
          X
        </button>
      </header>
      <main className=" flex flex-col gap-3 max-h-[90%] overflow-auto">
        <div className="client-information flex flex-col gap-2 [&_p]:m-0">
          <p>Client Information</p>
          <p>Name: {currentRecord?.appointee?.firstName} {currentRecord?.appointee?.lastName}</p>
          <p>Email: {currentRecord?.appointee?.email}</p>
          <p>Age: {currentRecord?.age}</p>
          <p>Session Number: {currentRecord?.sessionNumber}</p>
          <p>Reason for Counseling: {currentRecord?.appointee?.appointmentType}</p>
          <p>Department: {currentRecord?.appointee?.department}</p>
        </div>
        <div className="observation">
          <p>Counsellor Observation</p>
          <p>Observation: {currentRecord?.observation}</p>
          <p>Non-verbal Cues: {currentRecord?.nonVerbalCues}</p>
          <p>Discussion Summary: {currentRecord?.summary}</p>
          <p>Techniques Used: {currentRecord?.techniques}</p>
          <p>Action Plan: {currentRecord?.actionPlan}</p>
          <p>Next Appointment: {currentRecord?.nextAppointment}</p>
          <p>Evaluation: {currentRecord?.evaluation}</p>
        </div>
      </main>
    </div>
  );
}
