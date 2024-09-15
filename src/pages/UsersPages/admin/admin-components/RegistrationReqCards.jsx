import React from "react";
import toast from "react-hot-toast";
import { AdminAccepptStudentAccount } from "../../../../context/auth/adminCreateAccount";
import CheckMarkDark from "../../../../static/images/tick-mark-dark.png";
import DenyDark from "../../../../static/images/delete-dark.png";
import MoreDark from "../../../../static/images/more-dark.png";
const RegistrationReqCards = ({ pendingRegistrations }) => {
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
      await AdminAccepptStudentAccount(
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        studentIdnumber,
        department,
        requestID
      );
    } catch (error) {
      toastMessage(error);
    }
  };
  return (
    <div className="pending-registration-container [&_p]:m-0 flex flex-row items-center justify-between p-10 shadow-md rounded-[30px] w-1/2">
      <p className="capitalize font-semibold text-[#320000] ">
        {`${pendingRegistrations.firstName} ${pendingRegistrations.lastName}`}
        <br />
        <span className="text-[13px] text-[#969696] font-light normal-case">
          {pendingRegistrations.email}
        </span>
      </p>

      <p className="capitalize font-semibold text-[#320000] ">
        {pendingRegistrations.status}
        <br></br>
        <span className="text-[13px] text-[#969696] font-light ">
          Registration Status
        </span>
      </p>
      {pendingRegistrations.status === "Pending" ? (
        <div className="registration-buttons-container [&_button]:bg-transparent [&_button]:p-0 [&_button]:hover:bg-transparent gap-3 flex flex-row items-center ">
          <button
            className=""
            onClick={() =>
              handleApproveRegistrationRequest(
                pendingRegistrations.email,
                pendingRegistrations.password,
                pendingRegistrations.firstName,
                pendingRegistrations.lastName,
                pendingRegistrations.phoneNumber,
                pendingRegistrations.studentIdnumber,
                pendingRegistrations.department,
                pendingRegistrations.id
              )
            }
          >
            <img src={CheckMarkDark} alt="accept" height={35} width={35} />
          </button>
          <button className="">
            <img src={DenyDark} alt="deny" height={35} width={35} />
          </button>
          <button className="">
            <img src={MoreDark} alt="more" height={35} width={35} />
          </button>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default RegistrationReqCards;
