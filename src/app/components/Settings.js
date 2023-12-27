import React from "react";

export function Settings({ onProfileClose }) {
  return (
    <>
      <div className="toolbar">
        <h1>Settings</h1>
        <a className="close-btn" onClick={onProfileClose}>
          x
        </a>
      </div>

      <form className="profile-form">
        <div>
          <label htmlFor="picture">Profile Picture</label>
          <input type="file" id="picture" />
        </div>

        <div>
          <label htmlFor="config">Import Config</label>
          <input type="file" id="config" />
        </div>

        <div>
          <label htmlFor="theme">Theme</label>
          <select id="theme">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button type="submit">Save</button>
      </form>
    </>
  );
}
