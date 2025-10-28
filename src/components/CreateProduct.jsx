import React, { useState } from "react";
import axios from "axios";
import { PlusCircle, Loader2, ImagePlus } from "lucide-react";
import Sidebar from "../components/Sidebar";

const CreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "Culture's",
    sizes: "",
    colors: "",
    stock: "",
    images: "",
  });

  // 🔹 Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert string fields (comma-separated) to arrays
    const productData = {
      ...formData,
      sizes: formData.sizes
        ? formData.sizes.split(",").map((v) => v.trim())
        : [],
      colors: formData.colors
        ? formData.colors.split(",").map((v) => v.trim())
        : [],
      images: formData.images
        ? formData.images.split(",").map((v) => v.trim())
        : [],
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/api/product/create-product",
        productData,
        { withCredentials: true }
      );

      alert("✅ Product created successfully!");
      console.log(res.data);

      // ✅ Reset all fields after success
      setFormData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        brand: "Culture's",
        sizes: "",
        colors: "",
        stock: "",
        images: "",
      });
    } catch (error) {
      console.error("❌ Product creation failed:", error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <PlusCircle className="text-blue-600" /> Create Product
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  className="w-full border border-gray-300 rounded-lg p-2.5 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                ></textarea>
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Brand name"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Sizes & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    placeholder="e.g. S, M, L, XL"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    placeholder="e.g. Red, Black, White"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Image URLs */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URLs (comma separated)
                </label>
                <div className="flex items-center gap-2">
                  <ImagePlus className="text-gray-500" />
                  <input
                    type="text"
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    placeholder="Paste image links, separated by commas"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {formData.images && formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {formData.images
                      .split(",")
                      .map((src, i) => (
                        <img
                          key={i}
                          src={src.trim()}
                          alt="preview"
                          className="w-28 h-28 object-cover rounded-lg border"
                        />
                      ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Create Product"
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateProduct;
