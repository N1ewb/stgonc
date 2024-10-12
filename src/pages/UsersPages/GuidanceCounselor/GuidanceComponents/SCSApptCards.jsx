import More from "../../../../static/images/more-dark.png";

const SCSApptCards = ({ appt, setCurrentSCSAppt, currentSCSAppt }) => {
  const handleSetCurrentSCSAppt = () => {
    if(currentSCSAppt === null){
      setCurrentSCSAppt(appt);
    }else if(currentSCSAppt === appt) {
      setCurrentSCSAppt(null);
    } else {
      setCurrentSCSAppt(appt)
    }
  };

  return (
    <div className="rounded-3xl p-10 shadow-sm flex flex-row w-full justify-between items-center">
      <p className="text-[#320000] capitalize text-xl font-semibold">
        {appt.appointee.firstName} {appt.appointee.lastName} <br></br>
        <span className="text-[#c3c2c2] normal-case text-sm font-normal">
          {appt.appointee.email}
        </span>
      </p>
      <button className="bg-transparent" onClick={handleSetCurrentSCSAppt}>
        <img src={More} alt="More" height={35} width={35} />
      </button>
    </div>
  );
};

export default SCSApptCards;
