import React from "react";

export function LoginForm({ onLogin }) {
  return (
    <form className="login-form" onSubmit={onLogin}>
      <input name="username" type="text" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button className="submit-btn" type="submit">
        Login
      </button>
    </form>
  );
}
