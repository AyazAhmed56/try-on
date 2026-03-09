import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabase";
import TryOnRoom from "../components/tryon/TryOnRoom";

const TryOnPages = () => {
  const { id } = useParams();
  const [outfitImage, setOutfitImage] = useState(null);

  useEffect(() => {
    const loadOutfit = async () => {
      const { data, error } = await supabase
        .from("outfits")
        .select(`*, outfit_images(*)`)
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      const mainImage =
        data.outfit_images.find((i) => i.is_main)?.image_url ||
        data.outfit_images[0]?.image_url;

      setOutfitImage(mainImage);
    };

    loadOutfit();
  }, [id]);

  if (!outfitImage) {
    return <div className="p-10">Loading Try-On...</div>;
  }

  return <TryOnRoom outfitImage={outfitImage} />;
};

export default TryOnPages;
