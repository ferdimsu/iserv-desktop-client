import React from "react";
import "./Inbox.css";

import { ToolBar } from "./ToolBar";
import { MailTable } from "./MailTable";
import { Loader } from "../Util/Loader";

export function Inbox({ mails, loading, onSearch, onSync, onMenu }) {
  return (
    <div className="inbox">
      <ToolBar onSearch={onSearch} onSync={onSync} onMenu={onMenu} />
      {loading ? <Loader /> : <MailTable mails={mails} />}
    </div>
  );
}
