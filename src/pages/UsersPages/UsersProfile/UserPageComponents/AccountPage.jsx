import React from "react";

const AccountPage = ({ auth, db, user }) => {
  return (
    <div className="account-page-container shadow-md rounded-[20px] pt-10 pb-5 px-1 bg-[#f4f4f4] w-full flex flex-col gap-2 [&_p]:m-0">
      <p className="w-full px-3">
        General Account Details <br></br>
        <span className="text-[#828282] text-sm">Mange user profile</span>
      </p>

      <div className="div shadow-md rounded-[20px]  bg-white w-full flex flex-col gap-5 mb-10 p-4">
        <div className="email">
          <p>Email Address</p>
          <p className="text-sm">{user?.email}</p>
          <div className="line h-[1px] bg-[#c5c4c4] w-[98%]"></div>
        </div>

        <div className="phone-number">
          <p>Phone Number</p>
          <p className="text-sm border-solid border-[#bbbaba] border-[1px] rounded-md py-1 px-3">
            {user?.phoneNumber}
          </p>
        </div>
        <div className="school-id-number">
          <p>SPC ID Number</p>
          <p className="text-sm border-solid border-[#bbbaba] border-[1px] rounded-md py-1 px-3">
            {user?.facultyIdnumber}
          </p>
        </div>
      </div>
      <div className="personal-details shadow-md rounded-[20px]  bg-white w-full flex flex-col gap-4 p-4">
        <div className="firstname ">
          <p>Firstname</p>
          <p className="text-sm border-solid border-[#bbbaba] border-[1px] rounded-md py-1 px-3">
            {user?.firstName}
          </p>
        </div>
        <div className="lastname ">
          <p>Lastname</p>
          <p className="text-sm border-solid border-[#bbbaba] border-[1px] rounded-md py-1 px-3">
            {user?.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
