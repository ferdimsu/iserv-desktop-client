import React, { useState } from "react";

export function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState("");

  function handleChange(e) {
    setSearchText(e.target.value);
    onSearch(e.target.value);
  }

  return (
    <form className="toolbar-search">
      <input
        type="text"
        placeholder="Fast search"
        value={searchText}
        onChange={handleChange}
      ></input>
    </form>
  );
}
