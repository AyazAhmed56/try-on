import React, { useState } from "react";
import UserImageUpload from "./UserImageUpload";
import TryOnCanvas from "./TryOnCanvas";
import DownloadPreview from "./DownloadPreview";

const TryOnRoom = ({ outfitImage }) => {
  const [userImage, setUserImage] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Virtual Try-On Room</h1>

      <UserImageUpload setUserImage={setUserImage} />

      {userImage && (
        <TryOnCanvas userImage={userImage} outfitImage={outfitImage} />
      )}

      {userImage && <DownloadPreview />}
    </div>
  );
};

export default TryOnRoom;
