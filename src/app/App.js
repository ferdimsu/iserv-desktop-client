import React, { useEffect, useState } from "react";

import { ToolBar } from "./components/ToolBar";
import { MailTable } from "./components/MailTable";
import { LoginForm } from "./components/LoginForm";
import { Loader } from "./components/Loader";

export default function App() {
  const [mails, setMails] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Controlled elements
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Try to restore session on startup
  useEffect(() => {
    const restoreSession = async () => {
      const success = await window.iserv.restoreSession();
      setIsLoggedIn(success);
    };

    restoreSession();
  }, []);

  // Fetch mails on login
  useEffect(() => {
    let isSubscribed = true;

    const fetchMails = async () => {
      const result = await window.iserv.fetchInbox();
      if (isSubscribed && result.data) {
        setMails(result.data);
      }
    };

    if (isLoggedIn) fetchMails();

    return () => {
      isSubscribed = false;
    };
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const success = await window.iserv.login({ username, password });
    setIsLoggedIn(success);

    setLoading(false);
  };

  const handleSearch = async (searchText) => {
    console.log(searchText);
  };

  if (loading) return <Loader />;

  if (!isLoggedIn)
    return (
      <LoginForm
        onLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    );

  return (
    <>
      <ToolBar onSearch={handleSearch} />
      <MailTable mails={mails} />
    </>
  );
}
