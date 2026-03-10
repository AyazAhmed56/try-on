import React from "react";

const OutfitSelector = ({ setSelectedOutfit }) => {
  return (
    <div className="outfit-selector">
      <h2>Select Outfit</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <img
          src="/products/black-tshirt.png"
          width="120"
          onClick={() => setSelectedOutfit("black")}
          style={{ cursor: "pointer" }}
        />

        <img
          src="/products/white-tshirt.png"
          width="120"
          onClick={() => setSelectedOutfit("white")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default OutfitSelector;
