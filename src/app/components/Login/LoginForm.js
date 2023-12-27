import React from "react";
import "./Login.css";

export function LoginForm({
  onLogin,
  username,
  setUsername,
  password,
  setPassword,
}) {
  return (
    <form className="login-form" onSubmit={onLogin}>
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
      <button className="submit-btn" type="submit">
        Login
      </button>
    </form>
  );
}
