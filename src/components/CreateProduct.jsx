import React, { useState } from "react";
import axios from "axios";
import { Upload, PlusCircle, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const CreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "Culture's",
    sizes: [],
    colors: [],
    stock: "",
    images: [],
  });

  // 🔹 Handle simple field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle array fields (sizes, colors)
  const handleArrayChange = (e, field) => {
    const values = e.target.value.split(",").map((v) => v.trim());
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  // 🔹 Handle image upload preview
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else {
          data.append(key, value);
        }
      });

      const res = await axios.post("http://localhost:5000/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product created successfully!");
      console.log(res.data);

      setFormData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        brand: "Culture's",
        sizes: [],
        colors: [],
        stock: "",
        images: [],
      });
      setPreviewImages([]);
    } catch (error) {
      console.error("❌ Product creation failed:", error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
      

        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-20 lg:mt-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <PlusCircle className="text-blue-600" />
              Create Product
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Name */}
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
                    onChange={(e) => handleArrayChange(e, "sizes")}
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
                    onChange={(e) => handleArrayChange(e, "colors")}
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Images (Multiple)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex flex-col items-center justify-center w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                    <Upload className="text-gray-500" size={28} />
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {previewImages.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="preview"
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Product"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateProduct;
