import React, { useState } from "react";
import { Check, Shirt } from "lucide-react";

const outfits = [
  { id: "black", src: "/products/black-tshirt.png", label: "Black T-Shirt" },
  { id: "white", src: "/products/white-tshirt.png", label: "White T-Shirt" },
];

const OutfitSelector = ({ setSelectedOutfit }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
    setSelectedOutfit(id);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
        >
          <Shirt className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-base font-bold text-gray-900">Select Outfit</h2>
      </div>

      {/* Outfit Grid */}
      <div className="flex gap-4">
        {outfits.map(({ id, src, label }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? "border-green-500 bg-green-50/60 shadow-md shadow-green-100"
                  : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30 hover:shadow-sm"
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #16a34a, #059669)",
                  }}
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Image */}
              <div className="w-28 h-28 flex items-center justify-center rounded-xl overflow-hidden bg-gray-50">
                <img
                  src={src}
                  alt={label}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Label */}
              <span
                className={`text-xs font-semibold ${isSelected ? "text-green-700" : "text-gray-600"}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OutfitSelector;
