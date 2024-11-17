import { useEffect, useState } from "react";
import Footer from "../../../../components/userscard/Footer";
import More from "../../../../static/images/more-dark.png";
import { useDB } from "../../../../context/db/DBContext";

const SCSApptCards = ({ appt, setCurrentSCSAppt, currentSCSAppt }) => {
  const db = useDB();
  const [followups, setFollowups] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await db.subscribeToApptFollowupChanges(
        appt.id,
        (followups) => {
          setFollowups(followups);
          console.log(followups)
        }
      );
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);

  return (
    <div className="w-1/2">
      <div
        className={`datacard-container flex flex-col m-2 p-3 text-[#320000] rounded-3xl 
      shadow-inner border border-[#ADADAD] hover:shadow-lg hover:shadow-[#320000]/40 
      `}
      >
        {appt && (
          <>
            {" "}
            <div className="flex flex-row pb-3 gap-3 border-b border-[#777777]">
              <p className="text-[16px] flex flex-col">
                <span className="font-bold truncate w-full">{`${appt.appointee.firstName} ${appt.appointee.lastName}`}</span>

                <span className="text-[#360000] font-light text-[12px]">
                  {appt.appointee.email}
                </span>
              </p>
            </div>
            <footer className="pt-2 w-full">
              <Footer buttons={buttons} data={appt} />
            </footer>
          </>
        )}
      </div>
      <div className="followups-indicator w-full flex flex-wrap gap-2 ">
        {followups.length !== 0
          ? followups.map((followup) => {
              return <div className="p-2 border-solid border-black border-[1px] rounded-md">asdasdas</div>
            })
          : ""}
      </div>
    </div>
  );
};

export default SCSApptCards;
