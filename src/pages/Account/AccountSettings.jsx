import React, { useState, useEffect } from "react";
import { User, Lock, Bell, Upload, Trash2, Moon, Sun } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useTheme } from "../../contexts/ThemeContext";
import "react-toastify/dist/ReactToastify.css";
import "./AccountSettings.css";

const AccountSettings = () => {
  const { theme, toggleTheme } = useTheme();

  // ===============================
  // STATE
  // ===============================
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

  // ===============================
  // FETCH PROFILE DATA
  // ===============================
  useEffect(() => {
    const fetchProfile = async () => {
      const storedEmail = localStorage.getItem("email");
      if (!storedEmail) return;

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/users/email/${storedEmail}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        setUser({
          firstName: data.firstName || localStorage.getItem("firstName") || "",
          lastName: data.lastName || localStorage.getItem("lastName") || "",
          email: data.email || storedEmail,
          phone: data.phone || "",
          address: data.address || "",
          profileImg: data.profileImg || localStorage.getItem("profileImg") || "",
        });

        // Save to localStorage
        localStorage.setItem("firstName", data.firstName || "");
        localStorage.setItem("lastName", data.lastName || "");
        localStorage.setItem("phone", data.phone || "");
        localStorage.setItem("address", data.address || "");
        localStorage.setItem("profileImg", data.profileImg || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile info");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ===============================
  // IMAGE UPLOAD
  // ===============================
  const uploadImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUser((prev) => ({ ...prev, profileImg: e.target.result }));
      localStorage.setItem("profileImg", e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImg = () => {
    setUser((prev) => ({ ...prev, profileImg: "" }));
    localStorage.removeItem("profileImg");
  };

  // ===============================
  // DISPLAY INITIALS
  // ===============================
  const initials = () =>
    `${user.firstName[0] || "?"}${user.lastName[0] || ""}`.toUpperCase();

  // ===============================
  // SAVE PROFILE
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

      // Update localStorage
      localStorage.setItem("firstName", user.firstName);
      localStorage.setItem("lastName", user.lastName);
      localStorage.setItem("phone", user.phone);
      localStorage.setItem("address", user.address);
      localStorage.setItem("profileImg", user.profileImg || "");

      toast.success("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // TABS CONFIG
  // ===============================
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Security", icon: Lock },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "theme", label: "Theme", icon: theme === "dark" ? Sun : Moon },
  ];

  // ===============================
  // RENDER PROFILE TAB
  // ===============================
  const renderProfileTab = () => (
    <div className="card fade-in">
      <h2>Profile Information</h2>

      <div className="profile-box">
        <div className="profile-pic">
          {user.profileImg ? <img src={user.profileImg} alt="avatar" /> : <span>{initials()}</span>}
        </div>
        <div className="pic-btns">
          <label className="btn blue small">
            <Upload size={16} /> Upload
            <input type="file" hidden onChange={uploadImg} />
          </label>
          <button className="btn gray small" type="button" onClick={removeImg}>
            <Trash2 size={16} /> Remove
          </button>
        </div>
      </div>

      <form className="form" onSubmit={saveProfile}>
        <div className="row">
          <div className="field">
            <label>First Name</label>
            <input
              value={user.firstName}
              onChange={(e) => setUser((prev) => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input
              value={user.lastName}
              onChange={(e) => setUser((prev) => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
        </div>
        <div className="row">
          <div className="field">
            <label>Email</label>
            <input value={user.email} readOnly />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              value={user.phone}
              onChange={(e) => setUser((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>
        <div className="field">
          <label>Address</label>
          <input
            value={user.address}
            onChange={(e) => setUser((prev) => ({ ...prev, address: e.target.value }))}
          />
        </div>

        <button className="save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );

  // ===============================
  // RENDER OTHER TABS
  // ===============================
  const renderTab = () => {
    if (tab === "profile") return renderProfileTab();
    if (tab === "password") return <div className="card fade-in"><h2>Password Settings</h2><p>Coming soon...</p></div>;
    if (tab === "alerts") return <div className="card fade-in"><h2>Notification Preferences</h2><p>Coming soon...</p></div>;
    if (tab === "theme") return <div className="card fade-in"><h2>Theme</h2><button className="theme-btn" onClick={toggleTheme}>Switch to {theme === "light" ? "Dark Mode" : "Light Mode"}</button></div>;
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
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
        <main className="content">{loading ? <p>Loading profile...</p> : renderTab()}</main>
      </div>
    </>
  );
};

export default AccountSettings;
