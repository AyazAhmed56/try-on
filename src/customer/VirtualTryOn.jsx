import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { ArrowLeft } from "lucide-react";

const VirtualTryOn = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userImage, setUserImage] = useState(null);
  const [product, setProduct] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I'm your AI Fashion Stylist.\nUpload your photo and I'll analyze your style, body type, and recommend outfits for you.",
    },
  ]);

  const [input, setInput] = useState("");

  /* -------------------------------- */
  /* Fetch selected outfit from DB    */
  /* -------------------------------- */

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

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

  /* -------------------------------- */
  /* AI Photo Analysis (Simulated)    */
  /* -------------------------------- */

  const analyzePhoto = () => {
    const bodyTypes = ["Athletic", "Slim", "Average"];
    const tones = ["Light", "Medium", "Warm"];
    const fits = ["Slim Fit", "Regular Fit"];

    const bodyShape = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
    const skinTone = tones[Math.floor(Math.random() * tones.length)];
    const fit = fits[Math.floor(Math.random() * fits.length)];

    const colors = ["Black", "Navy", "Olive", "Grey", "White"];

    return {
      bodyShape,
      skinTone,
      fit,
      colors,
    };
  };

  /* -------------------------------- */
  /* Upload Photo                     */
  /* -------------------------------- */

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUserImage(url);

    const result = analyzePhoto();

    const aiMessage = {
      role: "bot",
      text: `🧠 AI Style Analysis Complete!

Body Shape: ${result.bodyShape}
Skin Tone: ${result.skinTone}

Recommended Fit:
${result.fit}

Best Outfit Colors:
${result.colors.join(", ")}

You can ask me:
• What outfits suit me?
• What colors match my skin tone?
• What size should I wear?
• What outfit works with this product?`,
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  /* -------------------------------- */
  /* Chat Logic                       */
  /* -------------------------------- */

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    let aiText =
      "I recommend minimal outfits with balanced colors and good fit.";

    const q = input.toLowerCase();

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

    const aiReply = { role: "bot", text: aiText };

    setMessages((prev) => [...prev, userMsg, aiReply]);
    setInput("");
  };

  /* -------------------------------- */
  /* UI                               */
  /* -------------------------------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/customer/dashboard"
                className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center space-x-2">
                  <span className="text-4xl">🎨</span>
                  <span>Virtual Try-On Studio</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  AI-Powered Fashion Styling Assistant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-linear-to-r from-purple-100 to-pink-100 border-2 border-purple-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
                ✨
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How AI Styling Works
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold shrink-0 mt-0.5">
                    1️⃣
                  </span>
                  <span>
                    Upload your photo for AI body shape & skin tone analysis
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold shrink-0 mt-0.5">
                    2️⃣
                  </span>
                  <span>
                    Get personalized outfit recommendations based on your
                    profile
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold shrink-0 mt-0.5">
                    3️⃣
                  </span>
                  <span>
                    Chat with AI stylist for color, fit, and styling advice
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* LEFT PANEL (Upload + Preview) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                  📸
                </div>
                <h2 className="text-xl font-bold text-gray-900">Your Photo</h2>
              </div>

              <label className="flex items-center justify-center bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl cursor-pointer w-full mb-4 hover:shadow-lg transition-all font-semibold">
                <span className="text-xl mr-2">📤</span>
                Upload Your Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleUpload}
                />
              </label>

              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative border-2 border-purple-200 rounded-2xl p-4 text-center bg-gray-50 min-h-75 flex items-center justify-center">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="User"
                      className="w-full h-72 object-contain rounded-xl"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">👤</div>
                      <p className="text-gray-400 font-medium">
                        Upload a photo to start
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        AI styling analysis
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {userImage && (
                <div className="mt-4 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 text-green-700">
                    <span className="font-bold text-lg">✓</span>
                    <span className="font-semibold text-sm">
                      Photo uploaded successfully!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Outfit */}
            {product && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                    👔
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Selected Outfit
                  </h2>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative border-2 border-purple-200 rounded-2xl p-4 text-center bg-gray-50">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-contain rounded-xl"
                      />
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl">
                  <p className="font-bold text-gray-900 text-center">
                    {product.name}
                  </p>
                  <p className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center mt-2">
                    ${product.price}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL (AI CHATBOT) */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg flex flex-col h-175">
            {/* Chat Header */}
            <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI Fashion Stylist</h2>
                  <p className="text-purple-100 text-sm">
                    Always here to help with styling advice
                  </p>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-linear-to-br from-gray-50 to-purple-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } animate-fadeIn`}
                >
                  <div className="flex items-start space-x-3 max-w-md">
                    {msg.role === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 text-lg">
                        🤖
                      </div>
                    )}
                    <div
                      className={`px-5 py-3 rounded-2xl whitespace-pre-line shadow-lg ${
                        msg.role === "user"
                          ? "bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none border border-purple-100"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-400 to-gray-500 flex items-center justify-center shrink-0 text-lg">
                        👤
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div className="p-6 bg-white border-t-2 border-purple-100 rounded-b-2xl">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ask the AI stylist anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 border-2 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                <button
                  onClick={sendMessage}
                  className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center justify-center hover:shadow-lg transition-all font-semibold"
                >
                  <span className="text-xl">📨</span>
                </button>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setInput("What outfits suit me?")}
                  className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-100 transition-all"
                >
                  💡 Outfit suggestions
                </button>
                <button
                  onClick={() => setInput("What colors match my skin tone?")}
                  className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-100 transition-all"
                >
                  🎨 Best colors
                </button>
                <button
                  onClick={() => setInput("What size should I wear?")}
                  className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-100 transition-all"
                >
                  📏 Size guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VirtualTryOn;
