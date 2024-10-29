import React, { useEffect, useState } from "react";
import Usercard from "../../../../../components/userscard/Usercard";
import { useUserList } from "../../../../../context/admin/UserListContext";
import More from "../../../../../static/images/more-dark.png";
import { useLocation } from "react-router-dom";

const StudentList = () => {
  const location = useLocation();
  const { currentCharacters, setCurrentUserInfo, setCategory } = useUserList();
  const [studentList, setstudentList] = useState([]);

  const handleSetCurrentUser = (user) => {
    setCurrentUserInfo((prevUser) => (prevUser === user ? null : user));
  };

  const buttons = [
    {
      src: More,
      alt: "More",
      function: (users) => handleSetCurrentUser(users),
      needsParams: true,
    },
  ];

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const pathSegment = location.pathname.split("/").pop();
    setCategory(capitalize(pathSegment));
  }, [location]);

  return (
    <div className="user-list flex flex-row flex-wrap items-start max-h-[100%]  overflow-auto py-3">
      {currentCharacters && currentCharacters.length !== 0 ? (
        currentCharacters.map((users, index) => (
          <div className="userlist-container w-[48%]" key={index}>
            <Usercard buttons={buttons} data={users} />
          </div>
        ))
      ) : (
        <p>No users</p>
      )}
    </div>
  );
};

export default StudentList;