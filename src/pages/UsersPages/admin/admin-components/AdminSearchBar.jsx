import React, { useEffect, useState, useCallback } from "react";
import { useDB } from "../../../../context/db/DBContext";

const AdminSearchBar = ({ datas, setData, temp, setCurrentPage }) => {
  const { getUser } = useDB();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [processedData, setProcessedData] = useState(new Map());

  const getSearchableUser = useCallback(async (id) => {
    if (!id) return null;
    if (processedData.has(id)) return processedData.get(id);
    try {
      const userData = await getUser(id);
      if (userData) {
        setProcessedData((prev) => new Map(prev).set(id, userData));
        return userData;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    return null;
  }, [getUser, processedData]);

  const performSearch = useCallback(async () => {
    if (!datas || isSearching) return;
    setIsSearching(true);
    try {
      if (searchQuery.trim()) {
        const searchTerms = searchQuery.toLowerCase().trim();
        const appointeeIds = [...new Set(datas.map((data) => data.appointee))];
        await Promise.all(
          appointeeIds.filter((id) => !processedData.has(id)).map(getSearchableUser)
        );

        const filteredData = datas.filter((data) => {
          const appointee = processedData.get(data.appointee) || {};
          const searchFields = [
            `${appointee.firstName || ""} ${appointee.lastName || ""}`,
            appointee.email,
            appointee.studentIdnumber,
            appointee.facultyIdnumber,
            `${data.firstName || ""} ${data.lastName || ""}`,
            data.email,
            data.studentIdnumber,
            data.facultyIdnumber,
          ].map((field) => String(field || "").toLowerCase());

          return searchFields.some((field) => field.includes(searchTerms));
        });

        setData(filteredData);
        setCurrentPage(1);
      } else {
        setData(temp);
      }
    } catch (error) {
      console.error("Search error:", error);
      setData(temp);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, datas, temp, processedData, getSearchableUser, setData, setCurrentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  useEffect(() => {
    if (datas && datas.length > 0) {
      datas.forEach((data) => {
        if (data.appointee && !processedData.has(data.appointee)) {
          getSearchableUser(data.appointee);
        }
      });
    }
  }, [datas, getSearchableUser]);

  return (
    <div className="w-full">
      <input
        name="search-appointments"
        type="text"
        className="w-full  rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
        placeholder="Search by name, email, or ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={isSearching}
      />
      {isSearching && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          Searching...
        </span>
      )}
    </div>
  );
};

export default AdminSearchBar;
