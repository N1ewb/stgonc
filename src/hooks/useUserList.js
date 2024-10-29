import { useEffect, useState } from "react";

export const useUserList = async (db, auth) => {
  const [userList, setUserList] = useState([]);
  const [currentCharacters, setcurrentCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temp, setTemp] = useState([]);
  const [paginationControls, setPaginationControls] = useState();
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  return {
    userList,
    setUserList,
    currentCharacters,
    setcurrentCharacters,
    loading,
    temp,
    setTemp,
    error,
    paginationControls,
    currentUserInfo,
    setCurrentUserInfo,
    currentPage,
    setCurrentPage,
    ITEMS_PER_PAGE,
    setITEMS_PER_PAGE,
  }

};

