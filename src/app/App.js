import React, { useEffect, useState } from "react";

import { ToolBar } from "./components/ToolBar";
import { MailTable } from "./components/MailTable";
import { LoginForm } from "./components/LoginForm";

export default function App() {
  const [mails, setMails] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // fetch the data from the server
  useEffect(() => {
    async function fetchMails() {
      if (!isLoggedIn) return;

      const result = await window.iserv.fetchInbox();
      if (result.data) setMails(result.data);
    }

    async function hasSession() {
      if (isLoggedIn) return;

      const session = await window.iserv.session();
      if (session) setIsLoggedIn(true);
    }

    hasSession();
    fetchMails();
  }, [isLoggedIn]);

  async function handleLogin(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const success = await window.iserv.login({ username, password });
    if (success) setIsLoggedIn((v) => !v);
    else {
      e.target.username.value = "";
      e.target.password.value = "";
    }
  }

  function handleSearch(searchText) {
    console.log(`Searching for ${searchText}`);
  }

  if (!isLoggedIn) return <LoginForm onLogin={handleLogin} />;
  return (
    <>
      <ToolBar onSearch={handleSearch} />
      <MailTable mails={mails} />
    </>
  );
}
