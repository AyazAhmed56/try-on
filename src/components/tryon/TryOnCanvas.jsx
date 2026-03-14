// import React, { useEffect, useRef, useState } from "react";

// import * as tf from "@tensorflow/tfjs";
// import "@tensorflow/tfjs-backend-webgl";

// import * as poseDetection from "@tensorflow-models/pose-detection";

// const TryOnCanvas = ({ userImage, outfitImage, size }) => {
//   const canvasRef = useRef(null);
//   const imgRef = useRef(null);

//   const [detector, setDetector] = useState(null);

//   useEffect(() => {
//     const loadModel = async () => {
//       await tf.setBackend("webgl");
//       await tf.ready();

//       const model = await poseDetection.createDetector(
//         poseDetection.SupportedModels.MoveNet,
//         {
//           modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
//         },
//       );

//       setDetector(model);
//     };

//     loadModel();
//   }, []);

//   useEffect(() => {
//     if (!detector || !userImage || !outfitImage) return;

//     const runTryOn = async () => {
//       const img = imgRef.current;

//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       canvas.width = img.width;
//       canvas.height = img.height;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       ctx.drawImage(img, 0, 0);

//       const poses = await detector.estimatePoses(img);

//       if (!poses.length) return;

//       const keypoints = poses[0].keypoints;

//       const leftShoulder = keypoints.find((k) => k.name === "left_shoulder");
//       const rightShoulder = keypoints.find((k) => k.name === "right_shoulder");
//       const leftHip = keypoints.find((k) => k.name === "left_hip");

//       if (!leftShoulder || !rightShoulder || !leftHip) return;

//       // center of shoulders
//       const centerX = (leftShoulder.x + rightShoulder.x) / 2;

//       const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);

//       const torsoHeight = Math.abs(leftHip.y - leftShoulder.y);

//       // size scaling
//       const sizeScale = {
//         S: 0.9,
//         M: 1,
//         L: 1.15,
//         XL: 1.3,
//       };

//       const scale = sizeScale[size] || 1;

//       const shirtWidth = shoulderWidth * 1.35 * scale;
//       const shirtHeight = torsoHeight * 1.25 * scale;

//       const shirtX = centerX - shirtWidth / 2;
//       const shirtY = leftShoulder.y - shirtHeight * 0.15;

//       const shirt = new Image();
//       shirt.crossOrigin = "anonymous";

//       shirt.src = outfitImage;

//       shirt.onload = () => {
//         ctx.drawImage(shirt, shirtX, shirtY, shirtWidth, shirtHeight);
//       };
//     };

//     runTryOn();
//   }, [detector, userImage, outfitImage, size]);

//   const downloadImage = () => {
//     const canvas = canvasRef.current;

//     const link = document.createElement("a");

//     link.download = "virtual-try-on.png";
//     link.href = canvas.toDataURL("image/png");

//     link.click();
//   };

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <img
//         ref={imgRef}
//         src={userImage}
//         alt="user"
//         style={{ display: "none" }}
//         crossOrigin="anonymous"
//       />

//       <canvas
//         ref={canvasRef}
//         style={{
//           border: "1px solid #ccc",
//           borderRadius: "10px",
//           maxWidth: "500px",
//         }}
//       />

//       <div>
//         <button
//           onClick={downloadImage}
//           style={{
//             marginTop: "10px",
//             padding: "8px 15px",
//             background: "black",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//           }}
//         >
//           Download Result
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TryOnCanvas;

import React, { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { supabase } from "../../services/supabase";
import { useParams } from "react-router-dom";

const TryOnCanvas = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { id } = useParams();

  const handleTryOn = async () => {
    console.log("Outfit ID from URL:", id);

    if (!id) {
      console.log("No outfit id found");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("tryon_images")
      .select("after_image")
      .eq("outfit_id", id)
      .maybeSingle();

    console.log("Supabase result:", data, error);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    if (!data) {
      alert("No try-on available for this outfit");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setResult(data.after_image);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-5 p-6">
      <button
        onClick={handleTryOn}
        disabled={loading}
        className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold text-white shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating Try-On…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Try On
          </>
        )}
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md shadow-green-200"
            style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
          >
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            AI is generating your look…
          </p>
        </div>
      )}

      {result && !loading && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm w-full max-w-sm">
            <img
              src={result}
              alt="Virtual try-on result"
              className="w-full h-auto object-contain"
              style={{ maxHeight: "480px" }}
            />
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-100 rounded-xl">
            <Sparkles className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-sm font-semibold text-green-700">
              Try-on complete!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryOnCanvas;
