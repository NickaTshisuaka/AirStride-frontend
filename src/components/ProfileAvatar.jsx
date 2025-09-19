import React, { useState, useEffect } from "react";
import { useAuthentication } from "../AuthContext";

const ProfileAvatar = () => {
  const { user } = useAuthentication(); // contains user info (name, jwt, etc.)
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    // Fetch user profile pic from backend
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (data.profilePic) {
          setProfilePic(data.profilePic);
        }
      } catch (err) {
        console.error("Error fetching profile pic:", err);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await fetch("http://localhost:5000/api/user/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.profilePic) setProfilePic(data.profilePic);
    } catch (err) {
      console.error("Error uploading profile picture:", err);
    }
  };

  return (
    <div className="profile-avatar">
      {profilePic ? (
        <img src={profilePic} alt="Profile" className="avatar-img" />
      ) : (
        <div className="avatar-fallback">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleUpload} />
    </div>
  );
};

export default ProfileAvatar;
