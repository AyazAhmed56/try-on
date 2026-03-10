import React from "react";

const DownloadPreview = ({ result }) => {
  if (!result) return null;

  return (
    <div>
      <h2>Download Result</h2>

      <a href={result} download>
        Download Image
      </a>
    </div>
  );
};

export default DownloadPreview;
