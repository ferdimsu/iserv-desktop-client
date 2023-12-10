import React, { useState } from "react";

export function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(searchText);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Fast search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      ></input>

      <button className="search-button" type="submit">
        Search
      </button>
    </form>
  );
}
