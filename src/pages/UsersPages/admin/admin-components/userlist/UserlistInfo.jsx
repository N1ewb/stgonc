import React from "react";

const UserlistInfo = ({ setCurrentUserInfo, currentUserInfo }) => {
  return (
    <div className="w-full h-auto flex flex-col p-5 shadow-md rounded-3xl">
      <header className="flex flex-row w-full justify-between items-center pb-3 border-b-[1px] border-solid border-[#c2c2c2]">
        <h3 className="font-light">
          User <span className="font-semibold">Info</span>
        </h3>
        <button
          className="bg-[#320000] hover:bg-[#720000] rounded-sm"
          onClick={() => setCurrentUserInfo(null)}
        >
          X
        </button>
      </header>
      <main className="flex flex-row w-full justify-between pt-3">
        <div className="[&_span]:text-[#838383] [&_span]:text-[14px]">
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
        <div className="m-w-1/2 h-[250px] w-[250px] rounded-md bg-[#320000]">
          <img
            src={currentUserInfo?.photoURL}
            alt="User profile"
            className="h-[100%] rounded-md max-h-[100%] w-full object-cover object-center"
          />
        </div>
      </main>
    </div>
  );
};

export default UserlistInfo;
