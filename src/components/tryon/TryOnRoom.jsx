import React, { useState } from "react";
import TryOnCanvas from "./TryOnCanvas";

const TryOnRoom = ({ outfitImage }) => {
  const [userImage, setUserImage] = useState(null);
  const [size, setSize] = useState("M");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUserImage(url);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Virtual Try-On Room</h1>

      {/* Upload */}
      <input type="file" accept="image/*" onChange={handleUpload} />

      {/* Size */}
      {userImage && (
        <div className="mt-3">
          <label>Select Size: </label>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border ml-2 p-1"
          >
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">XL</option>
          </select>

          <button
            onClick={() => setUserImage(null)}
            className="ml-3 px-3 py-1 bg-gray-200"
          >
            Upload New Photo
          </button>
        </div>
      )}

      {/* Canvas */}
      {userImage && (
        <TryOnCanvas
          userImage={userImage}
          outfitImage={outfitImage}
          size={size}
        />
      )}
    </div>
  );
};

export default TryOnRoom;
