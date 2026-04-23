import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserImageUpload from "./UserImageUpload";
import TryOnCanvas from "./TryOnCanvas";

import {
  ArrowLeft,
  Sparkles,
  Shirt,
  Upload,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

const TryOnRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedOutfit = location.state?.outfit || null;
  const productImage = location.state?.productImage || null;

  const [userImage, setUserImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!userImage || !selectedOutfit) return;

    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [userImage, selectedOutfit]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-green-50 text-gray-500 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {/* <Sparkles className="w-5 h-5 text-green-600" /> */}
              Virtual Try-On
            </h1>
            <p className="text-xs text-gray-400">
              See how you look in this outfit
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* How it works */}
        {/* <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                How it works
              </h3>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Select an outfit
                </div>

                <div className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Upload your photo
                </div>

                <div className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  AI generates your try-on result
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Outfit + Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Selected Outfit */}
          {productImage && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <Shirt className="w-4 h-4 text-green-600" />
                </div>

                <h3 className="text-base font-bold text-gray-900">
                  Selected Outfit
                </h3>
              </div>

              <div className="bg-gray-50 border rounded-2xl overflow-hidden">
                <img
                  src={productImage}
                  alt="Selected outfit"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "380px" }}
                />
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-semibold">
                  Outfit ready for try-on
                </span>
              </div>
            </div>
          )}

          {/* Upload User Image */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                <Upload className="w-4 h-4 text-green-600" />
              </div>

              <h3 className="text-base font-bold text-gray-900">
                Upload Your Photo
              </h3>
            </div>
            <UserImageUpload
              setUserImage={(img) => {
                setUserImage(img);
                setIsProcessing(true);
              }}
            />
          </div>
        </div>

        {/* Uploaded Image */}
        {userImage && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
            <h3 className="text-base font-bold mb-4 text-gray-900">
              Your Photo
            </h3>

            <div className="bg-gray-50 border rounded-2xl overflow-hidden max-w-md mx-auto">
              <img
                src={userImage}
                alt="User"
                className="w-full h-auto object-contain"
                style={{ maxHeight: "460px" }}
              />
            </div>
          </div>
        )}

        {/* Try-On Result */}
        {userImage && selectedOutfit && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-green-600" />

              <h3 className="text-xl font-bold text-green-700">
                Your Virtual Try-On Result
              </h3>
            </div>

            {isProcessing && (
              <div className="mb-5 p-4 bg-green-50 border border-green-100 rounded-xl flex justify-center gap-3">
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-green-700 font-semibold">
                  AI is preparing your try-on...
                </span>
              </div>
            )}

            <div className="rounded-2xl overflow-hidden border border-gray-100">
              <TryOnCanvas selectedOutfit={selectedOutfit} />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setUserImage(null)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-green-600 text-green-700 font-semibold hover:bg-green-50"
              >
                <RefreshCw className="w-4 h-4" />
                Try Different Photo
              </button>

              <button
                onClick={() => navigate("/customer/products")}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}
              >
                <Shirt className="w-4 h-4" />
                Try Different Outfit
              </button>
            </div>
          </div>
        )}

        {/* If no outfit */}
        {!productImage && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />

            <h3 className="text-base font-bold text-gray-900 mb-2">
              No Outfit Selected
            </h3>

            <button
              onClick={() => navigate("/customer/products")}
              className="px-6 py-3 rounded-xl text-white font-semibold"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              Browse Outfits
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TryOnRoom;
