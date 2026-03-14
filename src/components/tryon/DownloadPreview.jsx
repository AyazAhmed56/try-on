import React from "react";
import { Download, ImageIcon } from "lucide-react";

const DownloadPreview = ({ result }) => {
  if (!result) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-2xl">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
        >
          <ImageIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Try-On Result Ready
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Your styled image is ready to download
          </p>
        </div>
      </div>

      <a
        href={result}
        download
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 active:scale-[0.97] transition-all"
        style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
      >
        <Download className="w-4 h-4" />
        Download
      </a>
    </div>
  );
};

export default DownloadPreview;
