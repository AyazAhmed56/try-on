import React from "react";
import { Upload, ImageIcon } from "lucide-react";

const UserImageUpload = ({ setUserImage }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setUserImage(url);
    }
  };

  return (
    <label className="group flex flex-col items-center justify-center gap-3 w-full px-6 py-10 border-2 border-dashed border-green-200 rounded-2xl bg-green-50/40 hover:bg-green-50/70 hover:border-green-400 cursor-pointer transition-all duration-200">
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shadow-green-200 group-hover:scale-105 transition-transform duration-200"
        style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
      >
        <Upload className="w-5 h-5 text-white" />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">
          Click to upload your photo
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP supported</p>
      </div>

      {/* Hidden input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </label>
  );
};

export default UserImageUpload;
