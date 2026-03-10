import React from "react";

const UserImageUpload = ({ setUserImage }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setUserImage(url);
    }
  };

  return (
    <div className="upload-section">
      <h2>Upload Your Photo</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />
    </div>
  );
};

export default UserImageUpload;
