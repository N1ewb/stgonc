import More from "../../../../static/images/more-dark.png";

const SCSApptCards = ({ appt }) => {
  return (
    <div className="rounded-3xl p-10 shadow-sm flex flex-row w-1/2 justify-between items-center">
      <p className="text-[#320000] capitalize text-xl">
        {appt.appointee.firstname} {appt.appointee.lastname} <br></br>
        <span className="text-[#c3c2c2] normal-case text-sm">{appt.appointee.email}</span>
      </p>
      <img src={More} alt="More" height={35} width={35} />
    </div>
  );
};

export default SCSApptCards;
