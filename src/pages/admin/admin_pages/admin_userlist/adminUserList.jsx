import React, { useEffect, useState } from "react";

import defaultProfile from "../../../../static/images/default-profile.png";

import "./adminUserList.css";

const AdminUserList = ({ db, auth }) => {
  const [userList, setUserList] = useState();

  const handleGetAllUsers = async () => {
    const users = await db.getAllUsers();
    setUserList(users);
  };

  useEffect(() => {
    if (userList === undefined) {
      handleGetAllUsers();
    }
  }, []);

  return (
    <div className="admin-userlist-container">
      <h1>User List</h1>
      {userList && userList.length !== 0 ? (
        userList.map((users, index) => (
          <div className="userlist-container" key={index}>
            <img
              src={
                (auth.currentUser && auth.currentUser.photoUrl) ||
                defaultProfile
              }
              alt="default profile"
              height={25}
            />
            <p>{users.firstName}</p>
            <p>{users.lastName}</p>
            <p>{users.email}</p>
            <p>{users.role}</p>
            <p>{users.phoneNumber}</p>
            <div className="onlineStatus"></div>
            <div className="more-options"></div>
          </div>
        ))
      ) : (
        <p>No users</p>
      )}
    </div>
  );
};

export default AdminUserList;
