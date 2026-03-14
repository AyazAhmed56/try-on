import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabase";
import TryOnRoom from "../components/tryon/TryOnRoom";
import { Sparkles } from "lucide-react";

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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md shadow-green-200"
            style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
          >
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-medium">Loading Try-On…</p>
        </div>
      </div>
    );
  }

  return <TryOnRoom outfitImage={outfitImage} />;
};

export default TryOnPages;
