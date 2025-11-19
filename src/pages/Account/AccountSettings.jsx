// src/pages/AccountSettings/AccountSettings.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Upload,
  Trash2,
  Moon,
  Sun,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Confetti from "react-confetti";
import { useTheme } from "../../contexts/ThemeContext";
import "react-toastify/dist/ReactToastify.css";
import "./AccountSettings.css";

// Firebase imports
import { auth } from "../../../../config/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const AccountSettings = () => {
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();

  const [user, setUser] = useState({
    firstName: localStorage.getItem("firstName") || "",
    lastName: localStorage.getItem("lastName") || "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || "",
    address: localStorage.getItem("address") || "",
    profileImg: localStorage.getItem("profileImg") || "",
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("profile");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwUpdating, setPwUpdating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  /** Notifications */
  const [notifications, setNotifications] = useState([]);
  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    inApp: true,
    push: false,
  });

  // ===============================
  // Trigger Alerts
  // ===============================
  const triggerAlert = (type, message) => {
    let notifMsg = message || "";
    switch (type) {
      case "welcome":
        notifMsg = message || `Welcome back, ${user.firstName || "User"}!`;
        toast.info(notifMsg);
        break;
      case "profileSaved":
        notifMsg = message || "Profile saved successfully!";
        toast.success(notifMsg);
        break;
      case "passwordUpdated":
        notifMsg = message || "Password updated successfully!";
        toast.success(notifMsg);
        break;
      case "payment":
        notifMsg = message || "Payment successful! 🎉";
        toast.success(notifMsg);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        break;
      default:
        notifMsg = message || "Notification";
        toast(notifMsg);
    }

    // Only push notifications for enabled channels
    if (notifPrefs.inApp) {
      setNotifications((prev) => [
        { id: Date.now(), type, message: notifMsg, read: false },
        ...prev,
      ]);
    }
  };

  // ===============================
  // Fetch Profile
  // ===============================
  useEffect(() => {
    const fetchProfile = async () => {
      const storedEmail = localStorage.getItem("email");
      if (!storedEmail) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/users/email/${storedEmail}`);
        if (!res.ok) return;
        const data = await res.json();
        setUser({
          firstName: data.firstName || localStorage.getItem("firstName") || "",
          lastName: data.lastName || localStorage.getItem("lastName") || "",
          email: data.email || storedEmail,
          phone: data.phone || localStorage.getItem("phone") || "",
          address: data.address || localStorage.getItem("address") || "",
          profileImg: data.profileImg || localStorage.getItem("profileImg") || "",
        });
        localStorage.setItem("firstName", data.firstName || "");
        localStorage.setItem("lastName", data.lastName || "");
        localStorage.setItem("phone", data.phone || "");
        localStorage.setItem("address", data.address || "");
        localStorage.setItem("profileImg", data.profileImg || "");

        triggerAlert("welcome");
      } catch {}
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  // ===============================
  // Upload / Remove Profile Image
  // ===============================
  const uploadImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUser((prev) => ({ ...prev, profileImg: ev.target.result }));
      localStorage.setItem("profileImg", ev.target.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImg = () => {
    setUser((prev) => ({ ...prev, profileImg: "" }));
    localStorage.removeItem("profileImg");
  };
  const initials = () =>
    `${user.firstName[0] || "?"}${user.lastName[0] || ""}`.toUpperCase();

  // ===============================
  // Save Profile
  // ===============================
  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        profileImg: user.profileImg,
      };
      const res = await fetch(`http://localhost:5000/users/email/${user.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }
      localStorage.setItem("firstName", user.firstName);
      localStorage.setItem("lastName", user.lastName);
      localStorage.setItem("phone", user.phone);
      localStorage.setItem("address", user.address);
      localStorage.setItem("profileImg", user.profileImg || "");

      triggerAlert("profileSaved");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Password Change
  // ===============================
  const passwordStrength = (password) => {
    if (!password) return "";
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { label: "Weak", color: "weak" };
    if (score === 2) return { label: "Medium", color: "medium" };
    return { label: "Strong", color: "strong" };
  };
  const changePassword = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error("No authenticated user found.");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    const strength = passwordStrength(newPassword);
    if (!strength || strength.label === "Weak") {
      return toast.error("Choose a stronger password (min 8 chars, mix letters & numbers).");
    }
    setPwUpdating(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      triggerAlert("passwordUpdated");
    } catch (err) {
      console.error(err);
      const msg = err?.code || err?.message || "Failed to update password";
      if (msg.includes("wrong-password") || msg.toLowerCase().includes("incorrect")) {
        toast.error("Current password is incorrect");
      } else if (msg.includes("weak-password")) {
        toast.error("Weak password — at least 8 chars");
      } else if (msg.includes("requires-recent-login")) {
        toast.error("Sign in again and try updating password.");
      } else {
        toast.error(err.message || "Failed to update password");
      }
    } finally { setPwUpdating(false); }
  };

  // ===============================
  // TABS
  // ===============================
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Security", icon: Lock },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "theme", label: "Theme", icon: theme === "dark" ? Sun : Moon },
  ];

  // ===============================
  // RENDER TABS
  // ===============================
  const renderProfileTab = () => (
    <div className="card glass card-animate">
      <h2>Profile Information</h2>
      <div className="profile-box">
        <div className="profile-pic glass-avatar">
          {user.profileImg ? <img src={user.profileImg} alt="avatar" /> : <span>{initials()}</span>}
        </div>
        <div className="pic-btns">
          <label className="btn blue small">
            <Upload size={14} /> Upload
            <input type="file" hidden onChange={uploadImg} />
          </label>
          <button className="btn gray small" type="button" onClick={removeImg}>
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>

      <form className="form" onSubmit={saveProfile}>
        <div className="row">
          <div className="field">
            <label>First Name</label>
            <input value={user.firstName} onChange={(e) => setUser((prev) => ({ ...prev, firstName: e.target.value }))} />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input value={user.lastName} onChange={(e) => setUser((prev) => ({ ...prev, lastName: e.target.value }))} />
          </div>
        </div>
        <div className="row">
          <div className="field">
            <label>Email</label>
            <input value={user.email} readOnly />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={user.phone} onChange={(e) => setUser((prev) => ({ ...prev, phone: e.target.value }))} />
          </div>
        </div>
        <div className="field">
          <label>Address</label>
          <input value={user.address} onChange={(e) => setUser((prev) => ({ ...prev, address: e.target.value }))} />
        </div>

        <button className="save-btn" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );

  const renderPasswordTab = () => {
    const strength = passwordStrength(newPassword);
    return (
      <div className="card glass card-animate">
        <h2>Password Settings</h2>
        <form className="form password-form" onSubmit={changePassword}>
          <div className="field password-field">
            <label>Current Password</label>
            <div className="password-input-wrap">
              <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" required />
              <button type="button" className="icon-btn" onClick={() => setShowCurrent(s => !s)}>{showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>

          <div className="field password-field">
            <label>New Password</label>
            <div className="password-input-wrap">
              <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Choose a strong password" required />
              <button type="button" className="icon-btn" onClick={() => setShowNew(s => !s)}>{showNew ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
            {newPassword && (
              <div className={`password-strength ${strength?.color || ""}`}>
                <div className="bar">
                  <div className="fill" style={{ width: strength?.label === "Weak" ? "33%" : strength?.label === "Medium" ? "66%" : "100%" }} />
                </div>
                <div className="strength-label">{strength?.label}</div>
              </div>
            )}
          </div>

          <div className="field password-field">
            <label>Confirm New Password</label>
            <div className="password-input-wrap">
              <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" required />
              <button type="button" className="icon-btn" onClick={() => setShowConfirm(s => !s)}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
            {confirmPassword && (
              <div className={`match ${newPassword === confirmPassword ? "ok" : "wrong"}`}>
                {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </div>
            )}
          </div>

          <div className="pw-actions">
            <button className="save-btn" disabled={pwUpdating}>{pwUpdating ? "Updating..." : "Update Password"}</button>
          </div>
        </form>
      </div>
    );
  };

  const renderAlertsTab = () => (
    <div className="card glass card-animate">
      <h2>Notifications</h2>

      <div className="notif-preferences">
        <h4>Notification Preferences</h4>
        <label><input type="checkbox" checked={notifPrefs.email} onChange={() => setNotifPrefs(prev => ({ ...prev, email: !prev.email }))} /> Email</label>
        <label><input type="checkbox" checked={notifPrefs.inApp} onChange={() => setNotifPrefs(prev => ({ ...prev, inApp: !prev.inApp }))} /> In-App</label>
        <label><input type="checkbox" checked={notifPrefs.push} onChange={() => setNotifPrefs(prev => ({ ...prev, push: !prev.push }))} /> Push</label>
      </div>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={n.read ? "read" : "unread"}
              onClick={() =>
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === n.id ? { ...notif, read: true } : notif
                  )
                )
              }
            >
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderThemeTab = () => {
    const colors = ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6f42c1"];
    return (
      <div className="card glass card-animate">
        <h2>Theme Settings</h2>
        <div className="theme-toggle">
          <button className="theme-btn" onClick={toggleTheme}>
            Switch to {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
        <div className="accent-colors">
          <h4>Accent Color</h4>
          <div className="colors-list">
            {colors.map(c => (
              <div
                key={c}
                className={`color-swatch ${accentColor === c ? "selected" : ""}`}
                style={{ backgroundColor: c }}
                onClick={() => setAccentColor(c)}
              />
            ))}
          </div>
        </div>
        <div className="theme-preview" style={{ borderColor: accentColor }}>
          <p>Live preview of your theme!</p>
        </div>
      </div>
    );
  };

  const renderTab = () => {
    if (tab === "profile") return renderProfileTab();
    if (tab === "password") return renderPasswordTab();
    if (tab === "alerts") return renderAlertsTab();
    if (tab === "theme") return renderThemeTab();
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      {showConfetti && <Confetti recycle={false} numberOfPieces={250} />}
      <div className="settings-page">
        <aside className="side glass-side">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} className={`side-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                <Icon size={18} />
                <span className="side-label">{t.label}</span>
              </button>
            );
          })}
        </aside>
        <main className="content">{loading ? <p className="loading-txt">Loading profile...</p> : renderTab()}</main>
      </div>
    </>
  );
};

export default AccountSettings;
