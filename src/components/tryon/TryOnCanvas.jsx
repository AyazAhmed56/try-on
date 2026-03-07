import React, { useEffect, useRef } from "react";

const TryOnCanvas = ({ userImage, outfitImage }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!userImage || !outfitImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const userImg = new Image();
    const outfitImg = new Image();

    userImg.src = userImage;
    outfitImg.src = outfitImage;

    userImg.onload = () => {
      canvas.width = userImg.width;
      canvas.height = userImg.height;

      ctx.drawImage(userImg, 0, 0);

      outfitImg.onload = () => {
        const width = userImg.width * 0.6;
        const height = userImg.height * 0.5;

        const x = userImg.width * 0.2;
        const y = userImg.height * 0.25;

        ctx.drawImage(outfitImg, x, y, width, height);
      };
    };
  }, [userImage, outfitImage]);

  return (
    <div className="mt-6">
      <canvas ref={canvasRef} className="border rounded-lg" />
    </div>
  );
};

export default TryOnCanvas;
