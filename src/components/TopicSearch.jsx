import React, { useState, useRef, useEffect } from "react";
import jsonData from "../data/data.json";
import TagButton from "../components/TagButton";
import SelectedTag from "../components/SelectedTag";
import AutocompleteDropdown from "../components/AutocompleteDropdown";

const TopicSearch = ({ setTopicData }) => {
  const data = jsonData;

  const subjectTags = ["Math", "Science", "English", "History", "Art"];

  const [selectedTag, setSelectedTag] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddTag = (tag) => {
    setSelectedTag(tag);
    setSearchText(""); // Reset search text when a tag is selected
    setDropdownVisible(false);
  };

  const handleRemoveTag = () => {
    setSelectedTag(null);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setDropdownVisible(true);
  };

  const handleSelectItem = (item) => {
    console.log(item);
    setTopicData(item);
    setSearchText(item.title);
    setDropdownVisible(false);
  };

  const filteredData = data.filter((item) => {
    if (!item.title) return false; // Skip items without a title
    const matchesTag = selectedTag ? item.tag === selectedTag : true;
    const matchesSearchText = item.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesTag && matchesSearchText;
  });

  return (
    <div ref={inputRef} className="p-4">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search titles..."
          value={searchText}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {dropdownVisible && (
          <AutocompleteDropdown
            items={filteredData}
            onSelect={handleSelectItem}
          />
        )}
      </div>
      <div className="mb-4">
        {selectedTag && (
          <SelectedTag
            selectedTag={selectedTag}
            handleRemoveTag={handleRemoveTag}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {subjectTags.map((tag, i) => (
          <TagButton key={i} tag={tag} onClick={() => handleAddTag(tag)} />
        ))}
      </div>
    </div>
  );
};

export default TopicSearch;
