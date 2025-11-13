// ===============================
// AccountSettings.jsx
// Clean rebuild using GLOBAL THEME
// ===============================

import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Upload,
  Trash2
} from "lucide-react";
import "./AccountSettings.css";

// Global Theme
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

const AccountSettings = () => {
  const { theme, toggleTheme } = useTheme();

  
  const [profileImg, setProfileImg] = useState(null);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Password fields
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Tabs
  const [tab, setTab] = useState("profile");

  // Tab configuration
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Security", icon: Lock },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "theme", label: "Theme", icon: theme === "dark" ? Sun : Moon }
  ];

  // ===============================
  // Image Upload
  // ===============================
  const uploadImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setProfileImg(e.target.result);
    reader.readAsDataURL(file);
  };

  const initials = () =>
    `${first[0] || "?"}${last[0] || ""}`.toUpperCase();

  // ===============================
  // On Save Actions (mock)
  // ===============================
  const saveProfile = (e) => {
    e.preventDefault();
    alert("Profile Saved");
  };

  const updatePassword = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) return alert("Passwords do not match");
    alert("Password Updated");
  };

  // ===============================
  // Tab Renderer
  // ===============================
  const renderTab = () => {
    if (tab === "profile")
      return (
        <div className="card fade-in">
          <h2>Profile Information</h2>

          <div className="profile-box">
            <div className="profile-pic">
              {profileImg ? <img src={profileImg} alt="avatar" /> : <span>{initials()}</span>}
            </div>

            <div className="pic-btns">
              <label className="btn blue small">
                <Upload size={16} />
                Upload
                <input type="file" hidden onChange={uploadImg} />
              </label>

              <button className="btn gray small" onClick={() => setProfileImg(null)}>
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>

          <form className="form" onSubmit={saveProfile}>
            <div className="row">
              <div className="field">
                <label>First Name</label>
                <input value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>

              <div className="field">
                <label>Last Name</label>
                <input value={last} onChange={(e) => setLast(e.target.value)} />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Email</label>
                <input value={email} readOnly />
              </div>

              <div className="field">
                <label>Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <button className="save-btn">Save Changes</button>
          </form>
        </div>
      );

    if (tab === "password")
      return (
        <div className="card fade-in">
          <h2>Password Settings</h2>

          <form className="form" onSubmit={updatePassword}>
            <div className="field">
              <label>Current Password</label>
              <input type="password" value={currPass} onChange={(e) => setCurrPass(e.target.value)} />
            </div>

            <div className="row">
              <div className="field">
                <label>New Password</label>
                <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              </div>

              <div className="field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </div>
            </div>

            <button className="save-btn">Update Password</button>
          </form>
        </div>
      );

    if (tab === "alerts")
      return (
        <div className="card fade-in">
          <h2>Notification Preferences</h2>

          <div className="toggle-list">
            <label className="toggle-row">
              Email Alerts <input type="checkbox" defaultChecked />
            </label>

            <label className="toggle-row">
              Product Updates <input type="checkbox" defaultChecked />
            </label>

            <label className="toggle-row">
              Promotions <input type="checkbox" />
            </label>
          </div>
        </div>
      );

    if (tab === "theme")
      return (
        <div className="card fade-in">
          <h2>Theme</h2>

          <button className="theme-btn" onClick={toggleTheme}>
            Switch to {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      );
  };

  // ===============================
  // Layout
  // ===============================
  return (
    <div className="settings-page">
      <aside className="side">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              className={`side-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <Icon size={18} />
              {t.label}
            </button>
          );
        })}
      </aside>

      <main className="content">{renderTab()}</main>
    </div>
  );
};

export default AccountSettings;
