import React, { useState } from 'react';

export function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');

  function handleChange(e) {
    setSearchText(e.target.value);
    onSearch(e.target.value);
  }

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
        onChange={handleChange}
      ></input>

      <button className="search-button" type="submit">
        Search
      </button>
    </form>
  );
}
