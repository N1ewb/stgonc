export default function AppointmentRecordCard({
  appt,
  handleDownloadRecord,
  currentRecord,
  setCurrentRecord,
}) {
  const handleSetCurrentRecord = () => {
    setCurrentRecord(currentRecord == appt ? null : appt);
    console.log("Heelllllo", currentRecord)
  };
  return (
    <div
      onClick={handleSetCurrentRecord}
      className="cursor-pointer flex flex-col p-3 text-[#320000] rounded-3xl w-[60%] h-fit
      shadow-inner border border-[#ADADAD] hover:shadow-lg hover:shadow-[#320000]/40 bg-white"
    >
      <div className="flex flex-col justify-between border-b-[1px] border-[#7b7b7b] border-solid">
        <p className="text-[20px] font-bold">{appt.appointmentType}</p>
        <p className="">
          {appt.appointee.firstName} {appt.appointee.lastName}
        </p>
      </div>
      <div className="footer flex justify-between pt-2">
        <p>{appt.appointmentDate || appt.date}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownloadRecord(appt, e);
          }}
          className="bg-[#72B9FF] rounded-3xl px-4 py-1"
        >
          Download
        </button>
      </div>
    </div>
  );
}
