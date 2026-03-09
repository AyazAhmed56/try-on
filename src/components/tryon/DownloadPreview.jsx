import React from "react";

const DownloadPreview = () => {
  const downloadImage = () => {
    const canvas = document.querySelector("canvas");

    const link = document.createElement("a");

    link.download = "virtual-try-on.png";

    link.href = canvas.toDataURL("image/png", 1.0);

    link.click();
  };

  return (
    <div className="text-center mt-4">
      <button
        onClick={downloadImage}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Download Result
      </button>
    </div>
  );
};

export default DownloadPreview;
