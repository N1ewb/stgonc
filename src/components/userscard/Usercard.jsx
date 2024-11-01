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
      const handleGetAppointee = async (uid) => {
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
      handleGetAppointee(data.appointee);
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
      className={`datacard-container flex flex-col m-2 p-3 text-[#320000] rounded-3xl 
      shadow-inner border border-[#ADADAD] hover:shadow-lg hover:shadow-[#320000]/40 
      `}
    >
      {data && (
        <>
          {" "}
          <div className="flex flex-row pb-3 gap-3 border-b border-[#777777]">
            <img
              className="w-[50px] h-[50px] p-[2px] bg-[#320000] rounded-full object-cover"
              src={displayPhotoURL}
              alt="profile"
            />
            <p className="text-[16px] flex flex-col">
              <span className="font-bold truncate w-full">{`${displayFirstName} ${displayLastName}`}</span>

              <span className="text-[#360000] font-light text-[12px]">
                {displayEmail}
              </span>
            </p>
          </div>
          <footer className="pt-2 w-full">
            
            <Footer buttons={buttons} data={data} />
          </footer>
        </>
      )}
    </div>
  );
};

export default Usercard;
