import React from "react";

import { SearchBar } from "./SearchBar";

export function ToolBar({ onSearch }) {
  return (
    <div className="toolbar">
      <SearchBar onSearch={onSearch} />
      <Profile />
    </div>
  );
}

function Profile({}) {
  return <span className="profile-picture"></span>;
}
