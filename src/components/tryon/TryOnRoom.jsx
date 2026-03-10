// import React, { useState } from "react";
// import TryOnCanvas from "./TryOnCanvas";

// const TryOnRoom = ({ outfitImage }) => {
//   const [userImage, setUserImage] = useState(null);
//   const [size, setSize] = useState("M");

//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const url = URL.createObjectURL(file);
//     setUserImage(url);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Virtual Try-On Room</h2>

//       <input type="file" accept="image/*" onChange={handleUpload} />

//       {userImage && (
//         <>
//           <div style={{ marginTop: "10px" }}>
//             <label>Select Size: </label>

//             <select value={size} onChange={(e) => setSize(e.target.value)}>
//               <option value="S">Small</option>
//               <option value="M">Medium</option>
//               <option value="L">Large</option>
//               <option value="XL">XL</option>
//             </select>

//             <button
//               style={{ marginLeft: "10px" }}
//               onClick={() => setUserImage(null)}
//             >
//               Upload New Photo
//             </button>
//           </div>

//           <TryOnCanvas
//             userImage={userImage}
//             outfitImage={outfitImage}
//             size={size}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default TryOnRoom;

import React, { useState } from "react";
import UserImageUpload from "./UserImageUpload";
import OutfitSelector from "./OutfitSelector";
import TryOnCanvas from "./TryOnCanvas";

const TryOnRoom = () => {
  const [userImage, setUserImage] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  return (
    <div>
      <h1>Virtual Try On</h1>

      <UserImageUpload setUserImage={setUserImage} />

      {userImage && <img src={userImage} width="300" />}

      <OutfitSelector setSelectedOutfit={setSelectedOutfit} />

      {selectedOutfit && <TryOnCanvas selectedOutfit={selectedOutfit} />}
    </div>
  );
};

export default TryOnRoom;
