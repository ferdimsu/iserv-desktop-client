import React from "react";

import { Loader } from "../Util/Loader";

import LockSvg from "../../icons/lock.svg";
import "./Login.css";

export function LoginForm({
  onLogin,
  isLoading,
  username,
  setUsername,
  password,
  setPassword,
}) {
  return (
    <form className="login-form" onSubmit={onLogin}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <img className="lock-icon" src={LockSvg} alt="Lock" />
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-submit" type="submit">
            Login
          </button>
        </>
      )}
    </form>
  );
}
