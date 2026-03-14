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
        .select(`*, outfit_images(*), outfit_variants(*)`)
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
      setStocks(data.stock_quantity);
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
      let outfitId = id;
      if (isEdit) {
        const { error } = await supabase
          .from("outfits")
          .update({
            name: productName,
            brand: brandName,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            description,
            price: Number(price),
            discount_price: discountPrice ? Number(discountPrice) : null,
            stock_quantity: Number(stocks),
            material,
            care_instructions: careInstructions,
          })
          .eq("id", outfitId);
        if (error) throw error;
        await supabase
          .from("outfit_variants")
          .delete()
          .eq("outfit_id", outfitId);
        await supabase.from("outfit_images").delete().eq("outfit_id", outfitId);
      } else {
        const { data, error } = await supabase
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
              stock_quantity: Number(stocks),
              material,
              care_instructions: careInstructions,
            },
          ])
          .select()
          .single();
        if (error) throw error;
        outfitId = data.id;
      }
      if (selectedSizes.length && selectedColors.length) {
        const variants = [];
        selectedSizes.forEach((size) => {
          selectedColors.forEach((color) => {
            variants.push({ outfit_id: outfitId, size, color });
          });
        });
        const { error } = await supabase
          .from("outfit_variants")
          .insert(variants);
        if (error) throw error;
      }
      const images = [
        { outfit_id: outfitId, image_url: mainImage, is_main: true },
        ...additionalImages.map((img) => ({
          outfit_id: outfitId,
          image_url: img,
          is_main: false,
        })),
      ];
      const { error: imageError } = await supabase
        .from("outfit_images")
        .insert(images);
      if (imageError) throw imageError;
      alert(
        isEdit ? "Item updated successfully!" : "Item posted successfully!",
      );
      navigate("/seller/dashboard");
    } catch (error) {
      console.error(error);
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
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("garments")
        .upload(filePath, file);
      if (error) {
        console.error(error);
        alert("Upload failed");
        return;
      }
      const { data } = supabase.storage.from("garments").getPublicUrl(filePath);
      if (isMain) {
        setMainImage(data.publicUrl);
      } else {
        setAdditionalImages((prev) => [...prev, data.publicUrl]);
      }
    }
  };

  const removeAdditionalImage = (index) =>
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  const toggleSize = (size) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  const toggleColor = (color) =>
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );

  const addCustomColor = () => {
    if (!customColorName.trim()) {
      alert("Please enter a color name");
      return;
    }
    const newColor = { name: customColorName.trim(), code: customColorCode };
    setColorsList((prev) => [...prev, newColor]);
    setSelectedColors((prev) => [...prev, newColor.name]);
    setCustomColorName("");
    setCustomColorCode("#000000");
  };

  const getSizeOptions = () => {
    if (
      selectedCategory.includes("Shoes") ||
      selectedCategory.includes("Sandals")
    )
      return sizes.shoes;
    if (
      selectedCategory.includes("Kids") ||
      selectedCategory.includes("Newborn")
    )
      return sizes.kids;
    if (selectedCategory.includes("Accessories")) return sizes.accessories;
    if (selectedCategory.includes("Jewelleries")) return sizes.jewellery;
    return sizes.clothing;
  };

  // Reusable styles
  const inputCls =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all text-gray-800 placeholder-gray-400";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  const SectionHeader = ({ num, title }) => (
    <h2 className="text-base font-bold text-gray-900 flex items-center gap-3 mb-4">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
      >
        {num}
      </div>
      {title}
    </h2>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-125 h-125 bg-green-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-emerald-100 rounded-full blur-3xl opacity-40 animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Page Title */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
            {isEdit ? "Edit Item" : "Post New Item"}
          </h1>
          <p className="text-sm text-gray-400">
            Add a new product to your store
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 space-y-8">
          {/* ── 1. CATEGORY ── */}
          <div className="border-b border-gray-100 pb-7">
            <SectionHeader num="1" title="Category Selection" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Main Category *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("");
                  }}
                  className={inputCls}
                >
                  <option value="">Select Category</option>
                  {Object.keys(categories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCategory && categories[selectedCategory].length > 0 && (
                <div>
                  <label className={labelCls}>Subcategory *</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select Subcategory</option>
                    {categories[selectedCategory].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* ── 2. PRODUCT DETAILS ── */}
          <div className="border-b border-gray-100 pb-7">
            <SectionHeader num="2" title="Product Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>Product Name *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter brand name"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Product Description *</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product in detail…"
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {/* ── 3. PRICING ── */}
          <div className="border-b border-gray-100 pb-7">
            <SectionHeader num="3" title="Pricing & Stock" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Price (₹) *",
                  val: price,
                  set: setPrice,
                  placeholder: "0",
                },
                {
                  label: "Discount Price (₹)",
                  val: discountPrice,
                  set: setDiscountPrice,
                  placeholder: "0",
                },
                {
                  label: "Stock Quantity *",
                  val: stocks,
                  set: setStocks,
                  placeholder: "0",
                },
              ].map(({ label, val, set, placeholder }) => (
                <div key={label}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    placeholder={placeholder}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. COLORS ── */}
          <div className="border-b border-gray-100 pb-7">
            <SectionHeader num="4" title="Available Colors" />
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5 mb-5">
              {colorsList.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => toggleColor(color.name)}
                  className={`relative p-2.5 rounded-xl border-2 transition-all duration-200 ${selectedColors.includes(color.name) ? "border-green-500 bg-green-50/60" : "border-gray-200 hover:border-green-300"}`}
                >
                  <div
                    className="w-full h-10 rounded-lg mb-1.5"
                    style={{
                      backgroundColor: color.code,
                      border:
                        color.code === "#FFFFFF" ? "1px solid #E5E7EB" : "none",
                    }}
                  />
                  <p className="text-xs text-gray-600 text-center font-medium line-clamp-1">
                    {color.name}
                  </p>
                  {selectedColors.includes(color.name) && (
                    <div
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #16a34a, #059669)",
                      }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom color */}
            <div className="bg-green-50/60 border border-green-100 rounded-2xl p-5 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-green-600" /> Add Custom Color
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Color name (e.g., Wine Red)"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  className={`${inputCls} flex-1`}
                />
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColorCode}
                    onChange={(e) => setCustomColorCode(e.target.value)}
                    className="w-14 h-11 p-1 border border-gray-200 rounded-xl cursor-pointer"
                    title="Pick a color"
                  />
                  <button
                    type="button"
                    onClick={addCustomColor}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm shadow-green-200 hover:shadow-md transition-all"
                    style={{
                      background: "linear-gradient(135deg, #16a34a, #059669)",
                    }}
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            {selectedColors.length > 0 && (
              <div className="bg-green-50/40 border border-green-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">
                  Selected Colors ({selectedColors.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedColors.map((colorName) => {
                    const color = colorsList.find((c) => c.name === colorName);
                    return (
                      <span
                        key={colorName}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-green-100 shadow-sm text-sm"
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                          style={{ backgroundColor: color?.code || "#000000" }}
                        />
                        <span className="text-gray-700 font-medium">
                          {colorName}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleColor(colorName)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── 5. SIZES ── */}
          <div className="border-b border-gray-100 pb-7">
            <SectionHeader num="5" title="Available Sizes" />
            <div className="flex flex-wrap gap-2.5 mb-4">
              {getSizeOptions().map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${selectedSizes.includes(size) ? "text-white border-transparent shadow-sm" : "border-gray-200 text-gray-600 hover:border-green-400"}`}
                  style={
                    selectedSizes.includes(size)
                      ? {
                          background:
                            "linear-gradient(135deg, #16a34a, #059669)",
                        }
                      : {}
                  }
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSizes.length > 0 && (
              <div className="bg-green-50/40 border border-green-100 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-gray-500">
                  Selected:{" "}
                  <span className="text-green-700 font-bold">
                    {selectedSizes.join(", ")}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* ── 6. MATERIAL & CARE ── */}
          <div className="border-b border-gray-100 pb-7">
            <SectionHeader num="6" title="Material & Care Instructions" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g., 100% Cotton, Polyester Blend"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Care Instructions</label>
                <input
                  type="text"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="e.g., Machine wash cold, Tumble dry low"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* ── 7. IMAGES ── */}
          <div className="border-b border-gray-100 pb-7">
            <SectionHeader num="7" title="Product Images" />

            {/* Main image */}
            <div className="mb-5">
              <label className={labelCls}>Main Product Image *</label>
              <div
                onClick={() => mainImageRef.current?.click()}
                className="relative w-full h-72 border-2 border-dashed border-green-200 rounded-2xl hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer bg-gray-50 overflow-hidden"
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
                      className="absolute top-3 right-3 w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center shadow-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600">
                      Click to upload main image
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
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

            {/* Additional images */}
            <div>
              <label className={labelCls}>Additional Images (Up to 10)</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {additionalImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden border border-gray-100"
                  >
                    <img
                      src={img}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    <button
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {additionalImages.length < 10 && (
                  <div
                    onClick={() => additionalImagesRef.current?.click()}
                    className="w-full h-28 border-2 border-dashed border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer bg-gray-50 flex flex-col items-center justify-center gap-1.5"
                  >
                    <Upload className="w-5 h-5 text-green-400" />
                    <p className="text-xs text-gray-400 font-medium">
                      Add Image
                    </p>
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

          {/* ── SUBMIT ── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handlePostItem}
              className="flex-1 py-3.5 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 active:scale-[0.98] transition-all"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              <Save className="w-4 h-4" />
              {isEdit ? "Update Item" : "Post Item"}
            </button>
            <Link
              to="/seller/dashboard"
              className="px-7 py-3.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPostItem;
