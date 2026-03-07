import React from "react";

const UserImageUpload = ({ setUserImage }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUserImage(url);
  };

  return (
    <div className="space-y-2">
      <p className="font-semibold">Upload Your Photo</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="border p-2"
      />
    </div>
  );
};

export default UserImageUpload;
