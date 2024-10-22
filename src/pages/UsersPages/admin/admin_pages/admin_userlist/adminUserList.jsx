import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";

import defaultProfile from "../../../../../static/images/default-profile.png";
import More from "../../../../../static/images/more-dark.png";
import UserList from "../../admin-components/UserList";
import AdminSearchBar from "../../admin-components/AdminSearchBar";
import Loading from "../../../../../components/Loading/Loading";
import UserlistInfo from "../../admin-components/userlist/UserlistInfo";
import DefaultInfoScreen from "../../../../../components/appointments/DefaultInfoScreen";

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
  const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(10);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

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
    return <Loading />;
  }

  if (error) {
    return <div className="error-screen">{error}</div>;
  }

  return (
    <div className="admin-userlist-container relative w-full h-[100%] flex flex-col justify-between px-10 py-5 shadow-md rounded-3xl">
      <div className="flex flex-col items-start h-[100%] w-full ">
        <div className="admin-userlist-header w-full flex flex-row justify-between items-center [&_p]:m-0">
          <h1 className=" text-[#320000] basis-[20%] font-bold">
            User <span className="font-light">List</span>
          </h1>
          <div className="w-[85%] px-10 py-3 bg-[#320000] rounded-3xl flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <div className="buttons text-[15px] flex flex-row items-center [&_button]:px-8 [&_button]:py-2 [&_button]:rounded-2xl gap-3">
                <button className={`bg-white text-[#320000]`}>Faculty</button>
                <button className={`border-solid border-2 border-white bg-transparent`}>Student</button>
              </div>
              <p className="text-white">
                Number of user: <span className="font-bold">{temp.length}</span>
              </p>
            </div>
            <div className="search-container flex flex-row items-center gap-3">
              <p className="font-semibold text-white ">Search</p>
              <AdminSearchBar
                datas={userList}
                setData={setUserList}
                temp={temp}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
        <div className="h-[80%] max-h-[90%] flex flex-row w-full justify-between items-start">
          <div className="div flex flex-col max-h-full w-[48%]  p-0 m-0">
            <UserList
              currentCharacters={currentCharacters}
              defaultProfile={defaultProfile}
              More={More}
              setCurrentUserInfo={setCurrentUserInfo}
              currentUserInfo={currentCharacters}
            />
          </div>
          <div className="div flex flex-col w-[48%] h-full max-h-full p-0 m-0">
            {currentUserInfo ? (
              <UserlistInfo
                setCurrentUserInfo={setCurrentUserInfo}
                currentUserInfo={currentUserInfo}
              />
            ) : <DefaultInfoScreen />}
          </div>
        </div>
      </div>
      <div className="flex flex-row w-[95%] justify-between items-center absolute bottom-2 [&_p]:m-0 ">
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
            onChange={(e) =>
              setITEMS_PER_PAGE(Number(e.target.value), setCurrentPage(1))
            }
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
