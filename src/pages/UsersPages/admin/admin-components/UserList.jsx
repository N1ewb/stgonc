import React from "react";
import Usercard from "../../../../components/userscard/Usercard";

const UserList = ({
  currentCharacters,
  defaultProfile,
  More,
  setCurrentUserInfo,
  currentUserInfo,
}) => {
  const handleSetCurrentUser = (user) => {
    setCurrentUserInfo((prevUser) => (prevUser === user ? null : user));
  };

  const buttons = [
    {
      src:  More ,
      alt: "More",
      function: (users) => handleSetCurrentUser(users),
      needsParams: true
    },
  ];

  return (
    <div className="user-list flex flex-row flex-wrap items-start max-h-[100%]  overflow-auto py-3">
      {currentCharacters && currentCharacters.length !== 0 ? (
        currentCharacters.map((users, index) => (
          <div
            className="userlist-container w-[48%]"
            key={index}
          >
            <Usercard buttons={buttons} data={users} />
          </div>
        ))
      ) : (
        <p>No users</p>
      )}
    </div>
  );
};

export default UserList;
