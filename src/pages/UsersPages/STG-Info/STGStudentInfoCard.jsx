import React from "react";
import DefaultProfile from "../../../static/images/default-profile.png";
import download from "../../../static/images/download.png";

const StudentInfoCard = ({ currentAppointee }) => {
  const firstName = currentAppointee?.firstName || "Unknown";
  const lastName = currentAppointee?.lastName || "";
  const email = currentAppointee?.email || "No email available";
  const photoURL = currentAppointee?.photoURL || DefaultProfile;

  return (
    <div className="flex items-center justify-between p-2 bg-[#320000] shadow rounded-3xl gap-3 w-full">
      <div className="deets flex items-center gap-3">
        <img
          src={photoURL}
          alt="profile"
          className="w-[80px] h-[80px] rounded-full object-cover bg-[#fff] p-1"
        />
        <div className=" text-white">
          <h1 className="text-[20px] capitalize text-white m-0">{`${firstName} ${lastName}`}</h1>
          <p className="text-[#dfdfdf] m-0">{email}</p>
        </div>
      </div>
      <div className="export bg-white p-2 flex items-center gap-4 rounded-xl">
        <p className="[&_span]:font-bold text-[14px] m-0">
          You can <br />
          <span>Extract</span> and <span>Download</span> all data <br /> report
          from this student
        </p>
        <button className="bg-[#4CAF50] px-10 py-2 rounded-xl">
          <img src={download} alt="download" height={30} width={30} />
        </button>
      </div>
    </div>
  );
};

export default StudentInfoCard;
