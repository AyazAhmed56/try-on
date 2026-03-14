import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserImageUpload from "./UserImageUpload";
import TryOnCanvas from "./TryOnCanvas";

const TryOnRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedOutfit = location.state?.outfit;
  const productImage = location.state?.productImage;

  const [userImage, setUserImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  // Stop processing after canvas loads (simulated with timeout)
  React.useEffect(() => {
    if (userImage && selectedOutfit) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setIsProcessing(false);
      }, 3000); // Adjust based on your actual processing time
      return () => clearTimeout(timer);
    }
  }, [userImage, selectedOutfit]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all text-2xl"
              >
                ←
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center space-x-2">
                  <span className="text-4xl">✨</span>
                  <span>Virtual Try-On</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  See how you look in this outfit
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
                💡
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How it works
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    Select an outfit from our collection (already selected!)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>Upload a clear, full-body photo of yourself</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    Our AI will virtually dress you in the selected outfit
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Selected Product Section */}
          {productImage && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                  👔
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Selected Outfit
                </h3>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-gray-50 rounded-2xl overflow-hidden border-2 border-purple-200">
                  <img
                    src={productImage}
                    alt="Selected outfit"
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="flex items-center space-x-2 text-purple-700">
                  <span className="font-bold text-lg">✓</span>
                  <span className="font-semibold">Outfit ready for try-on</span>
                </div>
              </div>
            </div>
          )}

          {/* Upload Photo Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                📤
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Upload Your Photo
              </h3>
            </div>

            {/* Upload Component */}
            <UserImageUpload setUserImage={setUserImage} />

            {/* Tips */}
            {!userImage && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <span className="text-xl shrink-0 mt-0.5">💡</span>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Tips for best results:
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use a clear, well-lit photo</li>
                      <li>• Stand straight facing the camera</li>
                      <li>• Wear fitted clothing for accurate results</li>
                      <li>• Avoid busy backgrounds</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Show Uploaded Image */}
        {userImage && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fadeIn">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl">
                ✓
              </div>
              <h3 className="text-xl font-bold text-gray-900">Your Photo</h3>
            </div>
            <div className="relative group max-w-md mx-auto">
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden border-2 border-purple-200">
                <img
                  src={userImage}
                  alt="Your uploaded photo"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>
            <div className="mt-4 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-green-700">
                <span className="font-bold text-lg">✓</span>
                <span className="font-semibold">
                  Photo uploaded successfully! Processing...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Try-On Result */}
        {userImage && selectedOutfit && (
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                ✨
              </div>
              <h3 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Virtual Try-On Result
              </h3>
            </div>

            {/* Processing Indicator - Only show while processing */}
            {isProcessing && (
              <div className="mb-6 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span className="text-purple-700 font-semibold">
                    AI is working its magic...
                  </span>
                </div>
              </div>
            )}

            {/* Canvas Component */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative">
                <TryOnCanvas
                  userImage={userImage}
                  selectedOutfit={selectedOutfit}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setUserImage(null)}
                className="px-6 py-3 rounded-xl bg-white border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-all flex items-center justify-center space-x-2"
              >
                <span className="text-xl">📤</span>
                <span>Try Different Photo</span>
              </button>
              <button
                onClick={() => navigate("/customer/products")}
                className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span className="text-xl">👔</span>
                <span>Try Different Outfit</span>
              </button>
            </div>
          </div>
        )}

        {/* No Outfit Selected Warning */}
        {!productImage && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4 text-3xl">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Outfit Selected
            </h3>
            <p className="text-gray-600 mb-6">
              Please select an outfit from our collection to try on
            </p>
            <button
              onClick={() => navigate("/customer/products")}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2"
            >
              <span className="text-xl">👔</span>
              <span>Browse Outfits</span>
            </button>
          </div>
        )}
      </div>

      {/* Add fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TryOnRoom;
