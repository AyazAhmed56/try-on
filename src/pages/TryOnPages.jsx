import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabase";
import TryOnRoom from "../components/tryon/TryOnRoom";

const TryOnPages = () => {
  const { id } = useParams();
  const [outfit, setOutfit] = useState(null);

  useEffect(() => {
    const fetchOutfit = async () => {
      const { data, error } = await supabase
        .from("outfits")
        .select(
          `
          *,
          outfit_images(*)
        `,
        )
        .eq("id", id)
        .single();

      if (!error) setOutfit(data);
    };

    fetchOutfit();
  }, [id]);

  if (!outfit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Try-On Room...
      </div>
    );
  }

  const mainImage = outfit.outfit_images.find((i) => i.is_main)?.image_url;

  return <TryOnRoom outfitImage={mainImage} />;
};

export default TryOnPages;
