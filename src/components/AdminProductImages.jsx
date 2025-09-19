import React, { useState } from "react";

const AdminProductImages = ({ productId, token, onUpdated }) => {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);

  const handleSelect = (e) => setFiles(Array.from(e.target.files));

  const handleUpload = async () => {
    if (!files.length) return;
    setBusy(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));
    try {
      const res = await fetch(`/api/products/${productId}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      onUpdated?.(data.product);
      setFiles([]);
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
      <input type="file" multiple accept="image/*" onChange={handleSelect} />
      <button disabled={busy || files.length === 0} onClick={handleUpload}>
        {busy ? "Uploading..." : "Upload Images"}
      </button>

      {/* Quick previews */}
      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        {files.map((f, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(f)}
            alt={f.name}
            width={100}
            height={100}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminProductImages;
