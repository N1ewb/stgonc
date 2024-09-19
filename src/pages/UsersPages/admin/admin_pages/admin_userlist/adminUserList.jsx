import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";

import defaultProfile from "../../../../../static/images/default-profile.png";
import More from "../../../../../static/images/more-dark.png";
import UserList from "../../admin-components/UserList";
import AdminSearchBar from "../../admin-components/AdminSearchBar";

const ITEMS_PER_PAGE = 7;

const AdminUserList = () => {
  const db = useDB();
  const auth = useAuth();
  const [userList, setUserList] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationControls, setPaginationControls] = useState();
  const [currentCharacters, setcurrentCharacters] = useState();
  const [temp, setTemp] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToUserChanges((newUserList) => {
            setUserList(newUserList);
            setLoading(false);
            setTemp(newUserList);
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
      setcurrentCharacters(currentCharacters);

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
    <div className="admin-userlist-container w-full min-h-[100%] max-h-[100%] flex flex-col justify-between p-10 shadow-md rounded-3xl">
      <div className="flex flex-col items-start w-full ">
        <div className="admin-userlist-header w-full flex flex-row justify-between items-end">
          <h1 className="relative text-[#320000] font-semibold">
            User List{" "}
            <span className="absolute top-0 text-[#720000] font-semibold text-xs w-full">
              TotalUsers: {temp.length}
            </span>
          </h1>
          <AdminSearchBar datas={userList} setData={setUserList} temp={temp} />
        </div>
        <div className="div flex flex-col w-full basis-4/5 px-5">
          <UserList
            currentCharacters={currentCharacters}
            defaultProfile={defaultProfile}
            More={More}
          />
        </div>
      </div>
      {ITEMS_PER_PAGE < userList.length && (
        <div className="flex flex-row justify-between items-center">
          <p> Page {currentPage}</p>
          {paginationControls && (
            <div className="pagination-controls flex flex-row gap-2">
              {paginationControls}
            </div>
          )}
          <p></p>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
