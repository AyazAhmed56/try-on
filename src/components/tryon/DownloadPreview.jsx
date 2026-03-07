import React from "react";

const DownloadPreview = () => {
  const downloadImage = () => {
    const canvas = document.querySelector("canvas");

    const link = document.createElement("a");

    link.download = "try-on.png";

    link.href = canvas.toDataURL();

    link.click();
  };

  return (
    <button
      onClick={downloadImage}
      className="mt-4 bg-black text-white px-6 py-2 rounded"
    >
      Download Result
    </button>
  );
};

export default DownloadPreview;
