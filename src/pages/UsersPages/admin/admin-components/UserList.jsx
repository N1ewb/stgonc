import React from "react";

const UserList = ({ currentCharacters, defaultProfile, More }) => {
  return (
    <div className="user-list flex flex-col items-start gap-3 max-h-[100%] rounded-3xl overflow-auto">
      {currentCharacters && currentCharacters.length !== 0 ? (
        currentCharacters.map((users, index) => (
          <div
            className="userlist-container w-full flex flex-row gap-3 items-center [&_p]:m-0 px-8 py-2 shadow-md rounded-md  text-[#740000] md:px-3 "
            key={index}
          >
            <img
              className=" bg-[#720000] w-[50px] h-[50px] rounded-full object-cover"
              src={users.photoURL || defaultProfile}
              alt="default profile"
              width={25}
              height={25}
            />
            <p className="w-[15%] font-medium xl:w-[30%] md:w-[80%] capitalize">
              {users.firstName} {users.lastName}
            </p>

            <p className="w-[20%] xl:w-[30%] md:hidden">{users.email}</p>
            <p className="w-[15%] xl:hidden">{users.phoneNumber}</p>
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
