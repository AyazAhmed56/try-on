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

const TryOnCanvas = ({ selectedOutfit }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTryOn = () => {
    setLoading(true);

    setTimeout(() => {
      if (selectedOutfit === "black") {
        setResult("/tryon/after-black.png");
      } else {
        setResult("/tryon/after-white.png");
      }

      setLoading(false);
    }, 2000);
  };

  return (
    <div>
      <button onClick={handleTryOn}>Try On</button>

      {loading && <p>Generating Try-On...</p>}

      {result && <img src={result} width="350" />}
    </div>
  );
};

export default TryOnCanvas;
