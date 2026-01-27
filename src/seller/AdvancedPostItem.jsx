import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Save,
  Image as ImageIcon,
  Trash2,
  X,
  Check,
  Plus,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

const AdvancedPostItem = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [customColorName, setCustomColorName] = useState("");
  const [customColorCode, setCustomColorCode] = useState("#000000");

  const colors = [
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Red", code: "#EF4444" },
    { name: "Blue", code: "#3B82F6" },
    { name: "Navy Blue", code: "#1E3A8A" },
    { name: "Green", code: "#10B981" },
    { name: "Dark Green", code: "#047857" },
    { name: "Yellow", code: "#F59E0B" },
    { name: "Orange", code: "#F97316" },
    { name: "Pink", code: "#EC4899" },
    { name: "Purple", code: "#A855F7" },
    { name: "Brown", code: "#92400E" },
    { name: "Beige", code: "#D6C8A8" },
    { name: "Gray", code: "#6B7280" },
    { name: "Light Gray", code: "#D1D5DB" },
    { name: "Maroon", code: "#7F1D1D" },
    { name: "Turquoise", code: "#14B8A6" },
    { name: "Lavender", code: "#C4B5FD" },
    { name: "Cream", code: "#FEF3C7" },
    { name: "Gold", code: "#F59E0B" },
    { name: "Silver", code: "#9CA3AF" },
    { name: "Olive", code: "#84CC16" },
    { name: "Teal", code: "#0D9488" },
    { name: "Coral", code: "#FB7185" },
  ];

  const [colorsList, setColorsList] = useState(colors);
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stocks, setStocks] = useState("");

  const [material, setMaterial] = useState("");
  const [careInstructions, setCareInstructions] = useState("");

  const mainImageRef = useRef(null);
  const additionalImagesRef = useRef(null);
  const { user } = useAuth();

  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!id) return;

    const loadItem = async () => {
      const { data } = await supabase
        .from("outfits")
        .select(
          `
        *,
        outfit_images(*),
        outfit_variants(*)
      `,
        )
        .eq("id", id)
        .single();

      if (!data) return;

      setProductName(data.name);
      setBrandName(data.brand);
      setSelectedCategory(data.category);
      setSelectedSubcategory(data.subcategory);
      setDescription(data.description);
      setPrice(data.price);
      setDiscountPrice(data.discount_price);
      setStocks(data.stock);
      setMaterial(data.material);
      setCareInstructions(data.care_instructions);

      setMainImage(
        data.outfit_images.find((i) => i.is_main)?.image_url || null,
      );
      setAdditionalImages(
        data.outfit_images.filter((i) => !i.is_main).map((i) => i.image_url),
      );

      setSelectedSizes([...new Set(data.outfit_variants.map((v) => v.size))]);
      setSelectedColors([...new Set(data.outfit_variants.map((v) => v.color))]);
    };

    loadItem();
  }, [id]);

  const handlePostItem = async () => {
    if (!user) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      // ✅ BASIC VALIDATION
      if (
        !productName ||
        !selectedCategory ||
        !description ||
        !price ||
        !stocks ||
        !mainImage
      ) {
        alert("Please fill all required fields");
        return;
      }

      let outfitId = id; // id comes from useParams (edit mode)

      /* --------------------------------------------------
       1️⃣ CREATE OR UPDATE OUTFIT
    -------------------------------------------------- */

      if (isEdit) {
        // 🔁 UPDATE
        const { error: updateError } = await supabase
          .from("outfits")
          .update({
            name: productName,
            brand: brandName,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            description,
            price: Number(price),
            discount_price: discountPrice ? Number(discountPrice) : null,
            stock: Number(stocks),
            material,
            care_instructions: careInstructions,
          })
          .eq("id", outfitId);

        if (updateError) throw updateError;

        // ❌ REMOVE OLD VARIANTS & IMAGES
        await supabase
          .from("outfit_variants")
          .delete()
          .eq("outfit_id", outfitId);
        await supabase.from("outfit_images").delete().eq("outfit_id", outfitId);
      } else {
        // ➕ INSERT
        const { data: newOutfit, error: insertError } = await supabase
          .from("outfits")
          .insert([
            {
              seller_id: user.id,
              name: productName,
              brand: brandName,
              category: selectedCategory,
              subcategory: selectedSubcategory,
              description,
              price: Number(price),
              discount_price: discountPrice ? Number(discountPrice) : null,
              stock: Number(stocks),
              material,
              care_instructions: careInstructions,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        outfitId = newOutfit.id;
      }

      /* --------------------------------------------------
       2️⃣ INSERT VARIANTS (SIZE × COLOR)
    -------------------------------------------------- */

      if (selectedSizes.length && selectedColors.length) {
        const variantsPayload = [];

        selectedSizes.forEach((size) => {
          selectedColors.forEach((color) => {
            variantsPayload.push({
              outfit_id: outfitId,
              size,
              color,
            });
          });
        });

        const { error: variantError } = await supabase
          .from("outfit_variants")
          .insert(variantsPayload);

        if (variantError) throw variantError;
      }

      /* --------------------------------------------------
       3️⃣ INSERT IMAGES
    -------------------------------------------------- */

      const imagesPayload = [
        {
          outfit_id: outfitId,
          image_url: mainImage,
          is_main: true,
        },
        ...additionalImages.map((img) => ({
          outfit_id: outfitId,
          image_url: img,
          is_main: false,
        })),
      ];

      const { error: imageError } = await supabase
        .from("outfit_images")
        .insert(imagesPayload);

      if (imageError) throw imageError;

      /* --------------------------------------------------
       4️⃣ SUCCESS → REDIRECT
    -------------------------------------------------- */

      alert(
        isEdit ? "Item updated successfully!" : "Item posted successfully!",
      );
      navigate("/seller/dashboard");
    } catch (error) {
      console.error("Post item error:", error);
      alert("Something went wrong while saving the item");
    }
  };

  const categories = {
    "New Collection/Items": [],
    "Festival Offers": [],
    "Discount Offers": [],
    Men: [
      "Shirts",
      "T-Shirts",
      "Jeans",
      "Trousers",
      "Suits",
      "Jackets",
      "Sweaters",
      "Shorts",
      "Ethnic Wear",
      "Innerwear",
      "Sportswear",
    ],
    Women: [
      "Dresses",
      "Tops",
      "Sarees",
      "Salwar Suits",
      "Lehenga",
      "Jeans",
      "Skirts",
      "Jackets",
      "Ethnic Wear",
      "Western Wear",
      "Innerwear",
      "Sportswear",
    ],
    Kids: [
      "Boys Wear",
      "Girls Wear",
      "Infant Wear",
      "School Uniforms",
      "Party Wear",
      "Casual Wear",
    ],
    "Old Men": [
      "Comfortable Wear",
      "Traditional Wear",
      "Casual Shirts",
      "Trousers",
      "Sweaters",
      "Jackets",
    ],
    "Old Women": [
      "Comfortable Wear",
      "Sarees",
      "Salwar Suits",
      "Casual Wear",
      "Traditional Wear",
    ],
    Newborn: [
      "Bodysuits",
      "Rompers",
      "Sleep Suits",
      "Bibs",
      "Caps",
      "Mittens",
      "Booties",
    ],
    Accessories: [
      "Bags",
      "Wallets",
      "Belts",
      "Ties",
      "Scarves",
      "Hats",
      "Caps",
      "Sunglasses",
      "Watches",
      "Hair Accessories",
    ],
    Jewelleries: [
      "Necklaces",
      "Earrings",
      "Rings",
      "Bracelets",
      "Bangles",
      "Anklets",
      "Pendants",
      "Chains",
      "Brooches",
    ],
    Shoes: [
      "Formal Shoes",
      "Casual Shoes",
      "Sports Shoes",
      "Loafers",
      "Boots",
      "Sneakers",
    ],
    Sandals: [
      "Flat Sandals",
      "Heeled Sandals",
      "Flip Flops",
      "Slippers",
      "Gladiators",
      "Wedges",
    ],
  };

  const sizes = {
    clothing: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    shoes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    kids: ["0-3M", "3-6M", "6-12M", "1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    accessories: ["Small", "Medium", "Large", "Free Size"],
    jewellery: ["Adjustable", "Small", "Medium", "Large"],
  };

  const handleImageUpload = async (e, isMain = false) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = fileName;

      // ✅ Upload to Supabase Storage
      const { error } = await supabase.storage
        .from("garments") // bucket name
        .upload(filePath, file);

      if (error) {
        console.error(error);
        alert("Upload failed");
        return;
      }

      // ✅ Get public URL
      const { data } = supabase.storage.from("garments").getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // ✅ Save URL (NOT base64)
      if (isMain) {
        setMainImage(publicUrl);
      } else {
        setAdditionalImages((prev) => [...prev, publicUrl]);
      }
    }
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const addCustomColor = () => {
    if (!customColorName.trim()) {
      alert("Please enter a color name");
      return;
    }

    const newColor = {
      name: customColorName.trim(),
      code: customColorCode,
    };

    setColorsList((prev) => [...prev, newColor]);
    setSelectedColors((prev) => [...prev, newColor.name]);
    setCustomColorName("");
    setCustomColorCode("#000000");
  };

  const getSizeOptions = () => {
    if (
      selectedCategory.includes("Shoes") ||
      selectedCategory.includes("Sandals")
    ) {
      return sizes.shoes;
    } else if (
      selectedCategory.includes("Kids") ||
      selectedCategory.includes("Newborn")
    ) {
      return sizes.kids;
    } else if (selectedCategory.includes("Accessories")) {
      return sizes.accessories;
    } else if (selectedCategory.includes("Jewelleries")) {
      return sizes.jewellery;
    }
    return sizes.clothing;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Post New Item
          </h1>
          <p className="text-gray-600">Add a new product to your store</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="space-y-8">
            {/* Category Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                  1
                </div>
                Category Selection
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Category *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubcategory("");
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
                  >
                    <option value="">Select Category</option>
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory &&
                  categories[selectedCategory].length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory *
                      </label>
                      <select
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
                      >
                        <option value="">Select Subcategory</option>
                        {categories[selectedCategory].map((subcat) => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                  2
                </div>
                Product Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter brand name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description *
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                  3
                </div>
                Pricing & Stock
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={stocks}
                    onChange={(e) => setStocks(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                  4
                </div>
                Available Colors
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {colorsList.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleColor(color.name)}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedColors.includes(color.name)
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-md mb-2"
                      style={{
                        backgroundColor: color.code,
                        border:
                          color.code === "#FFFFFF"
                            ? "1px solid #E5E7EB"
                            : "none",
                      }}
                    ></div>
                    <p className="text-xs text-gray-700 text-center font-medium line-clamp-1">
                      {color.name}
                    </p>
                    {selectedColors.includes(color.name) && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Add Custom Color Section */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-600" />
                  Add Custom Color
                </h3>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Color name (e.g., Wine Red)"
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                  />

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customColorCode}
                      onChange={(e) => setCustomColorCode(e.target.value)}
                      className="w-16 h-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
                      title="Pick a color"
                    />

                    <button
                      type="button"
                      onClick={addCustomColor}
                      className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {selectedColors.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Selected Colors ({selectedColors.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map((colorName) => {
                      const color = colorsList.find(
                        (c) => c.name === colorName,
                      );
                      return (
                        <span
                          key={colorName}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-purple-200 shadow-sm"
                        >
                          <div
                            className="w-5 h-5 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: color?.code || "#000000",
                            }}
                          ></div>
                          <span className="text-sm text-gray-700 font-medium">
                            {colorName}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleColor(colorName)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                  5
                </div>
                Available Sizes
              </h2>

              <div className="flex flex-wrap gap-3">
                {getSizeOptions().map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                      selectedSizes.includes(size)
                        ? "border-purple-600 bg-purple-600 text-white shadow-md"
                        : "border-gray-300 hover:border-purple-400 text-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {selectedSizes.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700">
                    Selected Sizes:{" "}
                    <span className="text-purple-600">
                      {selectedSizes.join(", ")}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Material & Care */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                  6
                </div>
                Material & Care Instructions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g., 100% Cotton, Polyester Blend"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={careInstructions}
                    onChange={(e) => setCareInstructions(e.target.value)}
                    placeholder="e.g., Machine wash cold, Tumble dry low"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm">
                  7
                </div>
                Product Images
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Product Image *
                </label>
                <div
                  onClick={() => mainImageRef.current?.click()}
                  className="relative w-full h-80 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-purple-50 overflow-hidden"
                >
                  {mainImage ? (
                    <>
                      <img
                        src={mainImage}
                        alt="Main"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainImage(null);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium">
                        Click to upload main image
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images (Up to 10)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {additionalImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {additionalImages.length < 10 && (
                    <div
                      onClick={() => additionalImagesRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-all cursor-pointer bg-gray-50 hover:bg-purple-50 flex flex-col items-center justify-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Add Image</p>
                    </div>
                  )}
                </div>
                <input
                  ref={additionalImagesRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-8">
              <button
                type="button"
                onClick={handlePostItem}
                className="flex-1 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Post Item
              </button>
              <Link
                to="/seller-dashboard"
                className="px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-pulse { animation: pulse 4s ease-in-out infinite; }
        .delay-1000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default AdvancedPostItem;
