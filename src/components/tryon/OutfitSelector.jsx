import React from "react";

const OutfitSelector = ({ setOutfitImage }) => {
  const outfits = [
    "/outfits/jacket.png",
    "/outfits/shirt.png",
    "/outfits/dress.png",
  ];

  return (
    <div>
      <p className="font-semibold mb-2">Select Outfit</p>

      <div className="flex gap-4">
        {outfits.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="outfit"
            className="w-24 cursor-pointer border"
            onClick={() => setOutfitImage(img)}
          />
        ))}
      </div>
    </div>
  );
};

export default OutfitSelector;
