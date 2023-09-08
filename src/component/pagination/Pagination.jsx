import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, page }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      className={`flex justify-center mb-10 ${
        page === "adminList" ? "mt-10" : ""
      }`}
    >
      {currentPage > 1 && (
        <button
          className="px-4 py-1 mr-2 bg-blue-300 text-sm hover:bg-blue-500 text-white rounded-lg"
          onClick={handlePrevPage}
        >
          {"Prev"}
        </button>
      )}
      {currentPage < totalPages && (
        <button
          className="px-4 py-1 bg-blue-300 text-sm hover:bg-blue-500 text-white rounded-lg"
          onClick={handleNextPage}
        >
          {"Next"}
        </button>
      )}
    </div>
  );
};

export default Pagination;
