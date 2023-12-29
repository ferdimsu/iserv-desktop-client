import React, { useEffect, useState } from "react";

import { Loader } from "./components/Util/Loader";
import { LoginForm } from "./components/Login/LoginForm";
import { Inbox } from "./components/Inbox/Inbox";

export default function App() {
  const [mails, setMails] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Controlled elements
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Try to restore session on startup
  useEffect(() => {
    async function restoreSession() {
      const success = await window.iserv.restoreSession();
      setIsLoggedIn(success);
    }

    restoreSession();
  }, []);

  // Fetch mails on login
  useEffect(() => {
    let isSubscribed = true;

    async function fetchMails() {
      setLoading(true);
      const result = await window.iserv.fetchInbox();
      if (isSubscribed && result.data) {
        setMails(result.data);
      }

      setLoading(false);
    }

    if (isLoggedIn) fetchMails();

    return () => {
      isSubscribed = false;
    };
  }, [isLoggedIn]);

  // Handle events

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);

    const success = await window.iserv.login({ username, password });
    setIsLoggedIn(success);

    setLoading(false);
  }

  function handleSearch(searchText) {
    const searchQuery = searchText.toLowerCase();

    const searchResults = mails.map((mail) => {
      const name = mail.from.name.toLowerCase();
      mail.display = name.includes(searchQuery);

      return mail;
    });

    setMails(searchResults);
  }

  function handleMenuClick() {
    console.log("Menu clicked");
  }

  function handleSyncClick() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  // Render
  if (!isLoggedIn)
    return (
      <LoginForm
        onLogin={handleLogin}
        isLoading={loading}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    );

  return (
    <Inbox
      mails={mails}
      isLoading={loading}
      onSearch={handleSearch}
      onMenu={handleMenuClick}
      onSync={handleSyncClick}
    />
  );
}
