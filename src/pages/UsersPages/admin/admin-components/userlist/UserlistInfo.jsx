import React from "react";

const UserlistInfo = ({ setCurrentUserInfo, currentUserInfo }) => {
  return (
    <div className="w-full h-auto flex flex-col p-5 ">
      <header className="flex flex-row w-full justify-between items-center pb-5 ">
        <h3 className="font-light text-[32px]">
          User <span className="font-semibold">Info</span>
        </h3>
        <button
          className="bg-[#320000] hover:bg-[#720000] rounded-sm"
          onClick={() => setCurrentUserInfo(null)}
        >
          X
        </button>
      </header>
      <main className="flex flex-row w-full justify-between items-center pt-3 text-[#320000]">
        <div className=" [&_span]:font-bold [&_span]:text-[14px] [&_p]:font-light flex flex-col gap-3">
          <p className="capitalize">
            <span>Name: </span> {currentUserInfo.firstName}{" "}
            {currentUserInfo.lastName}
          </p>
          <p>
            <span>Email: </span>
            {currentUserInfo.email}
          </p>
          <p>
            <span>School ID Number: </span>
            {currentUserInfo.studentIdnumber || currentUserInfo.facultyIdnumber}
          </p>
          <p>
            <span>Role: </span>
            {currentUserInfo.role}
          </p>
        </div>
        <div className="m-w-1/2 h-[250px] w-[250px] rounded-3xl bg-[#320000] ">
          <img
            src={currentUserInfo?.photoURL}
            alt="User profile"
            className="h-[100%]  max-h-[100%] rounded-3xl w-full object-cover object-center"
          />
        </div>
      </main>
    </div>
  );
};

export default UserlistInfo;
