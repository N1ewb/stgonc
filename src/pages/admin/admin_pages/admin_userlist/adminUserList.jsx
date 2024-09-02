import React, { useEffect, useState } from "react";

import defaultProfile from "../../../../static/images/user-square-maroon.png";
import More from "../../../../static/images/more.png";
import MoreDark from "../../../../static/images/more-dark.png";

import "./adminUserList.css";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 11;

const AdminUserList = ({ db, auth }) => {
  const [userList, setUserList] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationControls, setPaginationControls] = useState();

  const toastMessage = (message) => toast(message);

  const handleGetAllUsers = async () => {
    try {
      const users = await db.getAllUsers();
      setUserList(users);
    } catch (error) {
      setError("Something went wrong while collecting users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToUserChanges((newUserList) => {
            setUserList(newUserList);
            setLoading(false);
          });
          return () => unsubscribe();
        } catch (error) {
          setError(error);
        }
      }
    };
    fetchData();
  }, [db, auth.currentUser]);

  useEffect(() => {
    if (userList) {
      const indexOfLastCharacter = currentPage * ITEMS_PER_PAGE;
      const indexOfFirstCharacter = indexOfLastCharacter - ITEMS_PER_PAGE;
      const currentCharacters = userList.slice(
        indexOfFirstCharacter,
        indexOfLastCharacter
      );

      const totalPages = Math.ceil(userList.length / ITEMS_PER_PAGE);
      const controls = Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`pagination-button hover:bg-[#862727] rounded-[4px] ${
            page === currentPage ? "bg-[#360000]" : "bg-[#740000] "
          }`}
        >
          {page}
        </button>
      ));

      setPaginationControls(controls);
    }
  }, [userList, currentPage]);

  if (loading) {
    return <div className="loading-screen">Loading Users...</div>;
  }

  if (error) {
    return <div className="error-screen">{error}</div>;
  }

  return (
    <div className="admin-userlist-container w-full min-h-[95%] max-h-[95%] flex flex-col gap-3">
      <h1 className="relative">
        User List{" "}
        <span className="absolute top-0 text-[#323232] font-semibold text-xs">
          TotalUsers: {userList.length}
        </span>
      </h1>
      <div className="user-list flex flex-col gap-3 max-h-[95%]">
        {userList && userList.length !== 0 ? (
          userList.map((users, index) => (
            <div
              className="userlist-container w-full flex flex-row justify-between gap-3 items-center [&_p]:m-0 px-8 py-2 rounded-[5px] bg-[#ebeaea] text-[#740000] md:px-3"
              key={index}
            >
              <img
                src={
                  (auth.currentUser && auth.currentUser.photoUrl) ||
                  defaultProfile
                }
                alt="default profile"
                width={25}
                height={25}
              />
              <p className="w-[15%] font-medium xl:w-[30%] md:w-[80%]">
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

      {ITEMS_PER_PAGE < userList.length && (
        <div className="flex flex-row justify-between items-center">
          <p> Page {currentPage}</p>
          {paginationControls && (
            <div className="pagination-controls">{paginationControls}</div>
          )}
          <p></p>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
