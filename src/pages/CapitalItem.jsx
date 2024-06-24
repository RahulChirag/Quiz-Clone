// src/components/CapitalItem.js
import React from "react";

const CapitalItem = ({ capital, onClick, id }) => {
  return (
    <div
      id={id}
      className="p-4 m-2 text-lg border rounded cursor-pointer bg-white hover:bg-green-200"
      onClick={onClick}
    >
      {capital}
    </div>
  );
};

export default CapitalItem;
