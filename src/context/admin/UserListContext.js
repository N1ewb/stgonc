import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useDB } from "../db/DBContext";

const UserListContext = createContext();

export function useUserList() {
  return useContext(UserListContext);
}

export const UserListProvider = ({ children }) => {
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
  const [category, setCategory] = useState("all");

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

      // Apply filtering based on category
      const filteredList =
        category === "all"
          ? userList
          : userList.filter((chars) => chars.role === category);
      console.log(category)
      const currentChars = filteredList.slice(
        indexOfFirstCharacter,
        indexOfLastCharacter
      );

      setcurrentCharacters(currentChars);

      const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
      const controls = Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`pagination-button hover:bg-[#862727] rounded-[4px] ${
            page === currentPage ? "bg-[#360000]" : "bg-[#740000]"
          }`}
        >
          {page}
        </button>
      ));

      setPaginationControls(controls);
    }
  }, [userList, currentPage, ITEMS_PER_PAGE, category]);

  const value = {
    userList,
    setUserList,
    loading,
    error,
    currentPage,
    setCurrentPage,
    paginationControls,
    setPaginationControls,
    currentCharacters,
    setcurrentCharacters,
    temp,
    setTemp,
    ITEMS_PER_PAGE,
    setITEMS_PER_PAGE,
    currentUserInfo,
    setCurrentUserInfo,
    setCategory,
  };

  return (
    <UserListContext.Provider value={value}>
      {children}
    </UserListContext.Provider>
  );
};
