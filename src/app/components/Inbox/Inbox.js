import React from "react";
import "./Inbox.css";

import { ToolBar } from "./ToolBar";
import { MailTable } from "./MailTable";
import { Loader } from "../Util/Loader";

export function Inbox({ mails, isLoading, onSearch, onSync, onMenu }) {
  return (
    <div className="inbox">
      <ToolBar onSearch={onSearch} onSync={onSync} onMenu={onMenu} />
      {isLoading ? <Loader /> : <MailTable mails={mails} />}
    </div>
  );
}
