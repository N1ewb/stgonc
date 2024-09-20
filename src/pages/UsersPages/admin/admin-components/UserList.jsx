import React from "react";

const UserList = ({ currentCharacters, defaultProfile, More }) => {
  return (
    <div className="user-list flex flex-col items-start gap-3 max-h-[100%] rounded-3xl overflow-auto py-3">
      {currentCharacters && currentCharacters.length !== 0 ? (
        currentCharacters.map((users, index) => (
          <div
            className="userlist-container w-full flex flex-row gap-3 items-center justify-between [&_p]:m-0 px-8 py-2 shadow-md rounded-md  text-[#740000] md:px-3 "
            key={index}
          >
            <div className="flex flex-row gap-3 w-[40%]">
              <img
                className=" bg-[#720000] w-[50px] h-[50px] rounded-full object-cover"
                src={users.photoURL || defaultProfile}
                alt="default profile"
                width={25}
                height={25}
              />
              <p className=" font-medium  capitalize">
                {users.firstName} {users.lastName}
                <br></br>
                <span className="text-[#d4d4d4] font-light normal-case">
                  {users.email}
                </span>
              </p>
            </div>

            <p className="w-[8%] xl:w-[10%] lg:hidden">{users.role}</p>

            <div className="more-options cursor-pointer hover:bg-white p-1 rounded-full">
              <img src={More} alt="more" width={25} height={25} />
            </div>
          </div>
        ))
      ) : (
        <p>No users</p>
      )}
    </div>
  );
};

export default UserList;
