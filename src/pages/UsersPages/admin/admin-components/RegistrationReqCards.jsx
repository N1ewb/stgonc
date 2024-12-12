import React from "react";
import toast from "react-hot-toast";
import { AdminAccepptStudentAccount } from "../../../../context/auth/adminCreateAccount";
import CheckMarkDark from "../../../../static/images/tick-mark-dark.png";
import DenyDark from "../../../../static/images/delete-dark.png";
import MoreDark from "../../../../static/images/more-dark.png";
import { useAuth } from "../../../../context/auth/AuthContext";
import { useDB } from "../../../../context/db/DBContext";
import { useMessage } from "../../../../context/notification/NotificationContext";
import { Tooltip } from "react-tooltip";
const RegistrationReqCards = ({
  pendingRegistrations,
  setCurrentOpenedRegistrationCard,
}) => {
  const auth = useAuth();
  const db = useDB();
  const notif = useMessage();
  const toastMessage = (message) => toast(message);

  const handleApproveRegistrationRequest = async (
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    studentIdnumber,
    department,
    requestID
  ) => {
    try {
      const res = await AdminAccepptStudentAccount(
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        studentIdnumber,
        department,
        requestID
      );
      if (res === 200) {
        await notif.storeNotifToDB(
          "Registration Accepted",
          "Your registration request has been approve by the administrator",
          email
        );
      }
    } catch (error) {
      toastMessage(error);
    }
  };

  const handleDenyRegistration = async () => {
    try {
      if (auth.currentUser) {
        await db.denyRegistration(
          pendingRegistrations.id,
          "Your registration request has been denied",
          pendingRegistrations.email
        );
      }
    } catch (error) {
      console.log("Error in denying registration");
    }
  };

  return (
    <div
      className={`datacard-container flex flex-col p-3 text-[#320000] rounded-3xl h-fit
      shadow-inner border border-[#ADADAD] hover:shadow-lg hover:shadow-[#320000]/40 
      `}
    >
      <div className="info-container flex w-full items-start border-b-[1px] border-[#7b7b7b] border-solid">
        <p className="capitalize font-semibold text-[#320000] ">
          {`${pendingRegistrations.firstName} ${pendingRegistrations.lastName}`}
          <br />
          <span className="text-[13px] text-[#969696] font-light normal-case">
            {pendingRegistrations.email}
          </span>
        </p>
      </div>
      <footer className="w-full items-center flex justify-between py-2">
        {" "}
        <p className="capitalize font-semibold text-[#320000] ">
          {pendingRegistrations.status}
        </p>
        {pendingRegistrations.status === "Pending" ? (
          <div className="registration-buttons-container w-full [&_button]:bg-transparent [&_button]:p-0 [&_button]:hover:bg-transparent gap-3 flex flex-row items-center justify-end">
            <button
              data-tooltip-id="approve-button"
              className=""
              onClick={() =>
                handleApproveRegistrationRequest(
                  pendingRegistrations.email,
                  pendingRegistrations.password,
                  pendingRegistrations.firstName,
                  pendingRegistrations.lastName,
                  pendingRegistrations.phoneNumber,
                  pendingRegistrations.studentIDnumber,
                  pendingRegistrations.department,
                  pendingRegistrations.id
                )
              }
            >
              <img src={CheckMarkDark} alt="accept" height={25} width={25} />
            </button>
            <button
              data-tooltip-id="deny-button"
              className=""
              onClick={handleDenyRegistration}
            >
              <img src={DenyDark} alt="deny" height={25} width={25} />
            </button>
            <button
            data-tooltip-id="more-button"
              className=""
              onClick={() =>
                setCurrentOpenedRegistrationCard(pendingRegistrations)
              }
            >
              <img src={MoreDark} alt="more" height={25} width={25} />
            </button>
          </div>
        ) : (
          <p></p>
        )}
      </footer>
      <Tooltip
        data-anchorselect=".approve-button"
        id="approve-button"
        place="top"
      >
        Approve Registration
      </Tooltip>
      <Tooltip data-anchorselect=".deny-button" id="deny-button" place="top">
        Deny Registration
      </Tooltip>
      <Tooltip data-anchorselect=".more-button" id="more-button" place="top">
        More Info
      </Tooltip>
    </div>
  );
};

export default RegistrationReqCards;
