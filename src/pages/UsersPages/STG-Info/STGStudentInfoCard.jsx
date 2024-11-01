import React from "react";
import DefaultProfile from "../../../static/images/default-profile.png";

const StudentInfoCard = ({ currentAppointee }) => {
  const firstName = currentAppointee?.firstName || "Unknown";
  const lastName = currentAppointee?.lastName || "";
  const email = currentAppointee?.email || "No email available";
  const photoURL = currentAppointee?.photoURL || DefaultProfile;

  return (
    <div className="flex flex-row items-center p-4 bg-white shadow rounded">
      <img
        src={photoURL}
        alt="profile"
        className="w-[80px] h-[80px] rounded-full object-cover bg-[#320000] p-1"
      />
      <div className="ml-4">
        <h1 className="text-[20px] capitalize">{`${firstName} ${lastName}`}</h1>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  );
};

export default StudentInfoCard;
