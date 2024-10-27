import More from "../../../../../static/images/more-dark.png";

const ApptListCard = ({ appointment, setCurrentWalkin, currentWalkin }) => {
  return (
    <div
      className={`datacard-container flex flex-col p-3 text-[#320000] rounded-3xl h-fit
      shadow-inner border border-[#ADADAD] hover:shadow-lg hover:shadow-[#320000]/40 
      `}
    >
      <div className="info-cotainer border-b-[1px] border-[#7b7b7b] border-solid">
        <p className="capitalize font-semibold">
          {`${appointment.appointee.firstName} ${appointment.appointee.lastName}`}
          <br />
          <span className="text-[12px] text-[#929292] normal-case font-light">{appointment.appointee.email}</span>
        </p>
      </div>
      <footer className="flex justify-between pt-2">
        <p className="font-medium">{appointment.appointmentStatus}</p>
        <button
          className="bg-transparent hover:bg-transparent p-0 m-0"
          onClick={() =>
            setCurrentWalkin(
              currentWalkin && currentWalkin === appointment
                ? null
                : appointment
            )
          }
        >
          <img src={More} alt="info" height={25} width={25} />
        </button>
      </footer>
    </div>
  );
};

export default ApptListCard;
