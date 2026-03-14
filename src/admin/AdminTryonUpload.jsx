import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { uploadImage } from "../services/uploadImage";

const AdminTryonUpload = () => {
  const [outfits, setOutfits] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    const { data, error } = await supabase.from("outfits").select(`
        id,
        name,
        outfit_images(image_url,is_main)
      `);

    if (error) {
      console.log(error);
      return;
    }

    const formatted = data.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.outfit_images?.find((img) => img.is_main)?.image_url,
    }));

    setOutfits(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOutfit) {
      alert("Select outfit");
      return;
    }

    setLoading(true);

    try {
      const afterUrl = await uploadImage(
        "tryon-images",
        `after/${selectedOutfit.id}.jpg`,
        afterImage,
      );

      const { error } = await supabase.from("tryon_images").insert([
        {
          outfit_id: selectedOutfit.id,
          after_image: afterUrl,
        },
      ]);

      if (error) throw error;

      alert("Try-on uploaded successfully");

      setAfterImage(null);
      setSelectedOutfit(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto" }}>
      <h2>Select Outfit</h2>

      <div
        style={{
          border: "1px solid #ddd",
          maxHeight: "300px",
          overflow: "auto",
          padding: "10px",
        }}
      >
        {outfits.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedOutfit(item)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              marginBottom: "8px",
              border:
                selectedOutfit?.id === item.id
                  ? "2px solid green"
                  : "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />

            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {selectedOutfit && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <h3>Upload After Try-On Image</h3>

          <input
            type="file"
            onChange={(e) => setAfterImage(e.target.files[0])}
            required
          />

          <br />
          <br />

          <button type="submit">{loading ? "Uploading..." : "Upload"}</button>
        </form>
      )}
    </div>
  );
};

export default AdminTryonUpload;
