import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import {
  ArrowLeft,
  Upload,
  User,
  Shirt,
  Bot,
  Send,
  Sparkles,
  CheckCircle,
  Lightbulb,
  Palette,
  Ruler,
} from "lucide-react";

const VirtualTryOn = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userImage, setUserImage] = useState(null);
  const [product, setProduct] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your AI Fashion Stylist.\nUpload your photo and I'll analyze your style, body type, and recommend outfits for you.",
    },
  ]);

  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("outfits")
        .select(`id, name, price, outfit_images(image_url, is_main)`)
        .eq("id", id)
        .single();
      if (data) {
        const image = data.outfit_images?.find((i) => i.is_main)?.image_url;
        setProduct({ id: data.id, name: data.name, price: data.price, image });
      }
    };
    fetchProduct();
  }, [id]);

  const analyzePhoto = () => {
    const bodyTypes = ["Athletic", "Slim", "Average"];
    const tones = ["Light", "Medium", "Warm"];
    const fits = ["Slim Fit", "Regular Fit"];
    return {
      bodyShape: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
      skinTone: tones[Math.floor(Math.random() * tones.length)],
      fit: fits[Math.floor(Math.random() * fits.length)],
      colors: ["Black", "Navy", "Olive", "Grey", "White"],
    };
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserImage(url);
    const result = analyzePhoto();
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: `AI Style Analysis Complete!\n\nBody Shape: ${result.bodyShape}\nSkin Tone: ${result.skinTone}\n\nRecommended Fit:\n${result.fit}\n\nBest Outfit Colors:\n${result.colors.join(", ")}\n\nYou can ask me:\n• What outfits suit me?\n• What colors match my skin tone?\n• What size should I wear?\n• What outfit works with this product?`,
      },
    ]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const q = input.toLowerCase();
    let aiText =
      "I recommend minimal outfits with balanced colors and good fit.";
    if (q.includes("color"))
      aiText =
        "Dark shades like navy, olive and black will complement your skin tone.";
    if (q.includes("size"))
      aiText =
        "Based on your body shape, a slim or tailored fit will look best.";
    if (q.includes("outfit"))
      aiText =
        "Try pairing this outfit with dark jeans and white sneakers for a clean modern look.";
    if (q.includes("style"))
      aiText =
        "Your look suits minimal modern fashion. Neutral tones and slim silhouettes will work great.";
    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "bot", text: aiText },
    ]);
    setInput("");
  };

  const suggestions = [
    {
      icon: <Lightbulb className="w-3 h-3" />,
      label: "Outfit suggestions",
      value: "What outfits suit me?",
    },
    {
      icon: <Palette className="w-3 h-3" />,
      label: "Best colors",
      value: "What colors match my skin tone?",
    },
    {
      icon: <Ruler className="w-3 h-3" />,
      label: "Size guide",
      value: "What size should I wear?",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/customer/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 transition-all"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                Virtual Try-On Studio
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                AI-Powered Fashion Styling Assistant
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Info Banner */}
        <div className="bg-green-50/70 border border-green-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                How AI Styling Works
              </h3>
              <div className="space-y-1.5">
                {[
                  "Upload your photo for AI body shape & skin tone analysis",
                  "Get personalized outfit recommendations based on your profile",
                  "Chat with AI stylist for color, fit, and styling advice",
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-gray-600"
                  >
                    <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-5">
          {/* LEFT PANEL */}
          <div className="lg:col-span-1 space-y-4">
            {/* Upload Section */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <User
                    className="w-4.5 h-4.5 text-green-600"
                    style={{ width: "18px", height: "18px" }}
                  />
                </div>
                <h2 className="text-base font-bold text-gray-900">
                  Your Photo
                </h2>
              </div>

              <label
                className="flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer w-full mb-4 shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 transition-all"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}
              >
                <Upload className="w-4 h-4" />
                Upload Your Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleUpload}
                />
              </label>

              <div className="border-2 border-dashed border-green-200 rounded-2xl bg-gray-50/80 min-h-50 flex items-center justify-center overflow-hidden">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="User"
                    className="w-full h-64 object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center py-8 px-4">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <User className="w-7 h-7 text-green-400" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">
                      Upload a photo to start
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      AI styling analysis
                    </p>
                  </div>
                )}
              </div>

              {userImage && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="text-xs font-semibold text-green-700">
                    Photo uploaded successfully!
                  </span>
                </div>
              )}
            </div>

            {/* Selected Outfit */}
            {product && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                    <Shirt className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">
                    Selected Outfit
                  </h2>
                </div>

                <div className="border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-44 object-contain p-2"
                    />
                  )}
                </div>

                <div className="mt-3 p-3 bg-green-50/60 border border-green-100 rounded-xl text-center">
                  <p className="text-sm font-semibold text-gray-800">
                    {product.name}
                  </p>
                  <p
                    className="text-xl font-bold mt-1 bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #16a34a, #059669)",
                    }}
                  >
                    ${product.price}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL — Chatbot */}
          <div
            className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col"
            style={{ height: "680px" }}
          >
            {/* Chat Header */}
            <div
              className="flex items-center gap-3 p-5 rounded-t-2xl border-b border-gray-100"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  AI Fashion Stylist
                </h2>
                <p className="text-green-100 text-xs">
                  Always here to help with styling advice
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span className="text-xs text-green-100 font-medium">
                  Online
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/40">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  style={{ animation: "fadeInUp 0.3s ease-out both" }}
                >
                  <div className="flex items-start gap-2.5 max-w-sm">
                    {msg.role === "bot" && (
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #16a34a, #059669)",
                        }}
                      >
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "text-white rounded-tr-sm"
                          : "bg-white text-gray-700 border border-gray-100 rounded-tl-sm"
                      }`}
                      style={
                        msg.role === "user"
                          ? {
                              background:
                                "linear-gradient(135deg, #16a34a, #059669)",
                            }
                          : {}
                      }
                    >
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
              <div className="flex gap-2.5 mb-3">
                <input
                  type="text"
                  placeholder="Ask the AI stylist anything…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all placeholder-gray-400"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2.5 rounded-xl text-white flex items-center justify-center shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 transition-all active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #16a34a, #059669)",
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2">
                {suggestions.map(({ icon, label, value }) => (
                  <button
                    key={label}
                    onClick={() => setInput(value)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium hover:bg-green-100 transition-colors"
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default VirtualTryOn;
