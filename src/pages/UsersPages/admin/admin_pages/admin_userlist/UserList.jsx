import React, { useEffect } from "react";
import Usercard from "../../../../../components/userscard/Usercard";
import More from '../../../../../static/images/more-dark.png'
import { useUserList } from "../../../../../context/admin/UserListContext";

const UserList = () => {
  const {
    currentCharacters,
    setCurrentUserInfo,
    setCategory,
  } = useUserList();
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


  useEffect(() => {
    setCategory("all");
  }, [setCategory]);

  return (
    <div className="user-list flex flex-row flex-wrap items-start max-h-[100%] gap-2 overflow-auto py-2">
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
