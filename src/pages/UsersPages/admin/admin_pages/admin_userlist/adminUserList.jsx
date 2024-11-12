import AdminSearchBar from "../../admin-components/AdminSearchBar";
import Loading from "../../../../../components/Loading/Loading";
import UserlistInfo from "../../admin-components/userlist/UserlistInfo";
import DefaultInfoScreen from "../../../../../components/appointments/DefaultInfoScreen";
import NavLink from "../../../../../components/buttons/NavLinks";
import { Outlet, useLocation } from "react-router-dom";
import { useUserList } from "../../../../../context/admin/UserListContext";
import { useEffect, useState } from "react";
import UserList from "./UserList";
import FacultyList from "./FacultyList";
import StudentList from "./StudentList";

const AdminUserList = () => {
  const location = useLocation();
  const {
    userList,
    setUserList,
    loading,
    error,
    currentPage,
    setCurrentPage,
    paginationControls,
    temp,
    ITEMS_PER_PAGE,
    setITEMS_PER_PAGE,
    currentUserInfo,
    setCurrentUserInfo,
    setCategory,
  } = useUserList();
  const [currentUserPageType, setCurrentPageType] = useState("all");

  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  useEffect(() => {
    setCategory("all");
  }, [location, setCategory]);

  const handleUserPageTypeChange = (type) => {
    setCurrentPageType((prevType) => (prevType === type ? "all" : type));
    console.log(type);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-screen">{error}</div>;
  }

  return (
    <div className="admin-userlist-container relative w-full h-[100%] flex flex-col justify-between px-10 ">
      <div className="flex flex-col items-start h-[100%] w-full ">
        <div className="admin-userlist-header w-full flex flex-row justify-between items-center [&_p]:m-0">
          <h1 className=" text-[#320000] basis-[20%] font-bold">
            User <span className="font-light">List</span>
          </h1>
          <div className="w-[85%] px-10 py-3 bg-[#320000] rounded-3xl flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <div className="buttons text-[15px] flex flex-row items-center gap-3">
                <button
                  className={`text-base w-full border-solid border-2 border-white rounded-2xl font-medium px-2 text-[12px] py-[6px] text-center transition-all duration-200  ${
                    currentUserPageType === 'Faculty'
                      ? "text-[#320000] bg-white "
                      : "hover:text-white text-white bg-transparent "
                  }`}
                  onClick={() => handleUserPageTypeChange("Faculty")}
                >
                  Faculty
                </button>
                <button
                  className={`text-base  w-full rounded-2xl border-solid border-2 border-white font-medium px-2 text-[12px] py-[6px] text-center transition-all duration-200  ${
                    currentUserPageType === 'Student'
                      ? "text-[#320000] bg-white "
                      : "hover:text-white text-white bg-transparent "
                  }`}
                  onClick={() => handleUserPageTypeChange("Student")}
                >
                  Student
                </button>
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
            {currentUserPageType === "all" ? (
              <UserList />
            ) : currentUserPageType === "Faculty" ? (
              <FacultyList />
            ) : currentUserPageType === "Student" ? (
              <StudentList />
            ) : (
              ""
            )}
          </div>
          <div className="div flex flex-col w-[48%] h-full max-h-full p-0 m-0">
            {currentUserInfo ? (
              <UserlistInfo
                setCurrentUserInfo={setCurrentUserInfo}
                currentUserInfo={currentUserInfo}
              />
            ) : (
              <DefaultInfoScreen />
            )}
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
