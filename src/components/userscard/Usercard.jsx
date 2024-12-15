import React, { useEffect, useState, useRef } from "react";
import "./Usercard.css";
import DefaultProfile from "../../static/images/default-profile.png";
import Footer from "./Footer";
import { useDB } from "../../context/db/DBContext";
import Loading from "../Loading/Loading";

const Usercard = ({ data, buttons }) => {
  const [appointee, setAppointee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isFetched = useRef(false);
  const db = useDB();

  useEffect(() => {
    if (data.appointee && !isFetched.current) {
      const handleGetAppointee = async () => {
        setLoading(true);

        try {
          const user = await db.getUser(data.appointee);
          setAppointee(user);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      handleGetAppointee();
      isFetched.current = true;
    } else {
      setLoading(false);
    }
  }, [data.appointee]);

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500">Error loading user data.</div>;

  const displayPhotoURL =
    data?.photoURL || appointee?.photoURL || DefaultProfile;
  const displayFirstName = data?.firstName || appointee?.firstName || "Unknown";
  const displayLastName = data?.lastName || appointee?.lastName || "";
  const displayEmail = data?.email || appointee?.email || "No email available";

  return (
    <div
      className={`datacard-container w-full flex flex-col m-2 p-3 text-[#320000] rounded-3xl 
      shadow-inner border border-[#ADADAD] hover:shadow-lg hover:shadow-[#320000]/40 overflow-hidden
      `}
    >
      {data && (
        <>
          <div className="flex flex-1 flex-wrap">
            <div className="flex-1 flex flex-row pb-3 gap-3 xsm:gap-2 xxsm:gap-1 xsm:pb-2 xxsm:pb-1 border-b border-[#777777] overflow-hidden">
              <img
                className="w-[50px] h-[50px] xl:w-[40px] xl:h-[40px] xsm:w-[30px] xsm:h-[30px] xxsm:w-[24px] xxsm:h-[24px] p-[2px] xsm:p-[1px] bg-[#320000] rounded-full object-cover"
                src={displayPhotoURL}
                alt="profile"
              />
              <p className="text-[16px] flex flex-col xl:w-[90%]">
                <span className="font-bold lg:truncate ... xl:w-[90%] xl:text-[1rem]  xsm:text-[12px] xxsm:text-[10px]">{`${displayFirstName} ${displayLastName}`}</span>

                <span className="text-[#360000] font-light text-[12px] xsm:text-[10px] xxsm:text-[8px] max-w-[90%] lg:truncate ...">
                  {displayEmail}
                </span>
              </p>
              <div className="text-end">
                {data?.isRescheduled && (
                  <p className="text-red-400 font-bold text-[12px]">
                    RESCHEDULED
                  </p>
                )}
              </div>
            </div>
          </div>
          <footer className="pt-2 flex-1">
            <Footer buttons={buttons} data={data} />
          </footer>
        </>
      )}
    </div>
  );
};

export default Usercard;
