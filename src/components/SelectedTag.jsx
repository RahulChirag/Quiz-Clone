import React from "react";

const SelectedTag = ({ selectedTag, handleRemoveTag }) => {
  return (
    <div className="flex items-center bg-gray-200 rounded-full px-3 py-1">
      <span className="mr-1 text-gray-700">{selectedTag}</span>
      <button
        onClick={handleRemoveTag}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default SelectedTag;
