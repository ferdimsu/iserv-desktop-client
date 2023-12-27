import React from "react";

import { SearchBar } from "./SearchBar";

import SyncIcon from "../../icons/sync.svg";
import MenuIcon from "../../icons/menu.svg";

export function ToolBar({ onSearch, onSync, onMenu }) {
  return (
    <div className="toolbar">
      <SearchBar onSearch={onSearch} />
      <ToolIcons onSync={onSync} onMenu={onMenu} />
    </div>
  );
}

function ToolIcons({ onSync, onCreate, onMenu }) {
  return (
    <li className="toolbar-icons">
      <ul>
        <a className="toolbar-icon toolbar-sync" onClick={onSync}>
          <img src={SyncIcon} alt="Syncronize" />
        </a>
      </ul>
      <ul>
        <a className="toolbar-icon toolbar-menu" onClick={onMenu}>
          <img src={MenuIcon} alt="Menu" />
        </a>
      </ul>
    </li>
  );
}
