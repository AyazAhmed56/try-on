import React, { useEffect, useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

const TryOnCanvas = ({ userImage, outfitImage, size }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const net = await bodyPix.load();
      setModel(net);
    };

    loadModel();
  }, []);

  useEffect(() => {
    if (!model || !userImage || !outfitImage) return;

    const runTryOn = async () => {
      const img = imgRef.current;

      const segmentation = await model.segmentPerson(img);

      const { width, height, data } = segmentation;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0);

      // Remove torso clothing
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      for (let i = 0; i < data.length; i++) {
        if (data[i] === 1) {
          const offset = i * 4;
          const y = Math.floor(i / width);

          if (y > height * 0.28 && y < height * 0.65) {
            pixels[offset + 3] = 0;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Shoulder approximation
      const leftShoulder = width * 0.3;
      const rightShoulder = width * 0.7;
      const shoulderY = height * 0.22;

      const shoulderWidth = rightShoulder - leftShoulder;

      const clothImg = new Image();
      clothImg.src = outfitImage;

      clothImg.onload = () => {
        let scale = 1;

        if (size === "S") scale = 0.9;
        if (size === "M") scale = 1;
        if (size === "L") scale = 1.1;
        if (size === "XL") scale = 1.2;

        const clothWidth = shoulderWidth * 1.2 * scale;
        const clothHeight = clothWidth * 1.15;

        const x = leftShoulder - clothWidth * 0.15;
        const y = shoulderY;

        ctx.drawImage(clothImg, x, y, clothWidth, clothHeight);
      };
    };

    runTryOn();
  }, [model, userImage, outfitImage, size]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");

    link.download = "virtual-try-on.png";
    link.href = canvas.toDataURL();

    link.click();
  };

  return (
    <div className="mt-4">
      <img
        ref={imgRef}
        src={userImage}
        alt="user"
        style={{ display: "none" }}
      />

      <canvas ref={canvasRef} className="border rounded-lg" />

      <button
        onClick={downloadImage}
        className="mt-3 bg-black text-white px-4 py-2 rounded"
      >
        Download Result
      </button>
    </div>
  );
};

export default TryOnCanvas;
