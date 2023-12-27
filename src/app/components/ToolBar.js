import React from "react";

import { SearchBar } from "./SearchBar";
import MenuIcon from "../icons/menu.svg";

export function ToolBar({ onSearch, onProfile }) {
  return (
    <div className="toolbar">
      <SearchBar onSearch={onSearch} />
      <MenuLink onProfile={onProfile} />
    </div>
  );
}

function MenuLink({ onProfile }) {
  return (
    <a className="menu-link" onClick={onProfile}>
      <img src={MenuIcon} alt="Menu" />
    </a>
  );
}
