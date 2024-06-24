import React from "react";

const AutocompleteDropdown = ({ items, onSelect }) => {
  return (
    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-60 overflow-y-auto">
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => onSelect(item)}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default AutocompleteDropdown;
