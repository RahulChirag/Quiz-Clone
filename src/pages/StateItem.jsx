// src/components/StateItem.js
import React from "react";

const StateItem = ({ state, onClick, id }) => {
  return (
    <div
      id={id}
      className="p-4 m-2 text-lg border rounded cursor-pointer bg-white hover:bg-blue-200"
      onClick={onClick}
    >
      {state}
    </div>
  );
};

export default StateItem;
