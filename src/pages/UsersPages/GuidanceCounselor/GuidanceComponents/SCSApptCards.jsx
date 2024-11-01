import Usercard from "../../../../components/userscard/Usercard";
import More from "../../../../static/images/more-dark.png";

const SCSApptCards = ({ appt, setCurrentSCSAppt, currentSCSAppt }) => {
  const handleSetCurrentSCSAppt = () => {
    if (currentSCSAppt === null) {
      setCurrentSCSAppt(appt);
    } else if (currentSCSAppt === appt) {
      setCurrentSCSAppt(null);
    } else {
      setCurrentSCSAppt(appt);
    }
  };
  const buttons = [
    {
      src: More,
      alt: "More",
      function: () => handleSetCurrentSCSAppt(),
      needsParams: false,
    },
  ];

  return (
    <div className="w-1/2">
      <Usercard data={appt} buttons={buttons} />
    </div>
  );
};

export default SCSApptCards;
