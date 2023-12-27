import React, {useEffect, useState} from "react";

import {ToolBar} from "./components/ToolBar";
import {MailTable} from "./components/MailTable";
import {LoginForm} from "./components/LoginForm";
import {Loader} from "./components/Loader";
import {Settings} from "./components/Settings";


export default function App() {
    const [mails, setMails] = useState([]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(false);

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

            await window.iserv.fetchUserInfo("uwe.");
        };

        if (isLoggedIn) fetchMails();

        return () => {
            isSubscribed = false;
        };
    }, [isLoggedIn]);

    // Handle events

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        const success = await window.iserv.login({username, password});
        setIsLoggedIn(success);

        setLoading(false);
    };

    const handleSearch = async (searchText) => {
        const searchQuery = searchText.toLowerCase();

        const searchResults =
            mails.map((mail) => {
                const name = mail.from.name.toLowerCase();
                mail.display = name.includes(searchQuery);

                return mail;
            });

        setMails(searchResults);
    };

    const handleProfileClick = () => {
        setProfile(v => !v);
    };

    // Render

    if (loading) return <Loader/>;
    if (profile) return <Settings onProfileClose={handleProfileClick}/>;
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
            <ToolBar onSearch={handleSearch} onProfile={handleProfileClick}/>
            <MailTable mails={mails}/>
        </>
    );
}
