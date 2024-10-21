import More from "../../../../../static/images/more-dark.png";

const ApptListCard = ({ appointment, setCurrentWalkin, currentWalkin }) => {
  return (
    <div className="flex flex-row shadow-md items-center rounded-3xl p-5 justify-between">
      <p className="capitalize">
        Name: {appointment.appointee.firstName} {appointment.appointee.lastName}
      </p>

      <p>Date: {appointment.appointmentDate}</p>
      <button
        className="bg-transparent hover:bg-transparent p-0 m-0"
        onClick={() =>
          setCurrentWalkin(
            currentWalkin && currentWalkin === appointment ? null : appointment
          )
        }
      >
        <img src={More} alt="info" height={25} width={25} />
      </button>
    </div>
  );
};

export default ApptListCard;
