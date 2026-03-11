import React, { useState, useEffect } from "react";
import { Camera, Upload, Sparkles, Send, Bot, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabase";

const VirtualTryOn = () => {
  const { id } = useParams();

  const [userImage, setUserImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your VirtualFit AI assistant 👗 Ask me for outfit suggestions.",
    },
  ]);

  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("outfits")
        .select(
          `
        id,
        name,
        price,
        outfit_images(image_url,is_main)
      `,
        )
        .eq("id", id)
        .single();

      if (data) {
        const image = data.outfit_images?.find((i) => i.is_main)?.image_url;

        setProduct({
          id: data.id,
          name: data.name,
          price: data.price,
          image,
        });
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(URL.createObjectURL(file));
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];

    // Fake AI reply (you can connect OpenAI later)
    const aiReply = {
      role: "bot",
      text: "Based on your style, I recommend slim fit outfits and dark colors.",
    };

    setMessages([...newMessages, aiReply]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Virtual Try-On Studio
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload + Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5" /> Try Your Outfit
          </h2>

          {/* Upload */}
          <div className="mb-4">
            <label className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded cursor-pointer w-fit">
              <Upload className="w-4 h-4" />
              Upload Your Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleUpload}
              />
            </label>
          </div>

          {/* Preview */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Image */}
            <div className="border rounded-xl p-4 text-center">
              <p className="font-semibold mb-2">Your Photo</p>
              {userImage ? (
                <img src={userImage} className="w-full h-72 object-contain" />
              ) : (
                <p className="text-gray-400">Upload a photo</p>
              )}
            </div>

            {/* Outfit */}
            <div className="border rounded-xl p-4 text-center">
              <p className="font-semibold mb-2">Selected Outfit</p>
              {product?.image && (
                <img
                  src={product.image}
                  className="w-full h-72 object-contain"
                />
              )}
              <p className="mt-2 font-semibold">{product?.name}</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-6 bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Recommendations
            </h3>

            <ul className="text-sm mt-2 space-y-1">
              <li>✔ Slim fit jeans</li>
              <li>✔ White sneakers</li>
              <li>✔ Minimal accessories</li>
            </ul>
          </div>
        </div>

        {/* AI Chatbot */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5" /> Fashion AI Assistant
          </h2>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-xs ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about outfits..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />

            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white px-3 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
