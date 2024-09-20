import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";

import defaultProfile from "../../../../../static/images/default-profile.png";
import More from "../../../../../static/images/more-dark.png";
import UserList from "../../admin-components/UserList";
import AdminSearchBar from "../../admin-components/AdminSearchBar";

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
  const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(6);
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
  }, [userList, currentPage, ITEMS_PER_PAGE]);

  if (loading) {
    return <div className="loading-screen">Loading Users...</div>;
  }

  if (error) {
    return <div className="error-screen">{error}</div>;
  }

  return (
    <div className="admin-userlist-container relative w-full h-[100%] flex flex-col justify-between px-10 py-5 shadow-md rounded-3xl">
      <div className="flex flex-col items-start h-[100%] w-full ">
        <div className="admin-userlist-header w-full flex flex-row justify-between items-end">
          <h1 className="relative text-[#320000] font-semibold">
            User List{" "}
            <span className="absolute top-0 text-[#720000] font-semibold text-xs w-full">
              TotalUsers: {temp.length}
            </span>
          </h1>
          <AdminSearchBar
            datas={userList}
            setData={setUserList}
            temp={temp}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <div className="div flex flex-col w-1/2 h-[80%] max-h-[80%] p-0 m-0">
          <UserList
            currentCharacters={currentCharacters}
            defaultProfile={defaultProfile}
            More={More}
          />
        </div>
      </div>
      <div className="flex flex-row w-[95%] justify-between items-center absolute bottom-1 [&_p]:m-0 ">
        <p> Page {currentPage}</p>
        {ITEMS_PER_PAGE < userList.length && paginationControls && (
          <div className="pagination-controls flex flex-row gap-2">
            {paginationControls}
          </div>
        )}
        <div className="group">
          <label htmlFor="rows-per-page">Rows per page</label>
          <select
            id="rows-per-page"
            name="rows-per-page"
            className="rows-per-page border-transparent focus:outline-none focus:ring-0"
            onChange={(e) => setITEMS_PER_PAGE(Number(e.target.value))}
          >
            <option value="6">6</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
