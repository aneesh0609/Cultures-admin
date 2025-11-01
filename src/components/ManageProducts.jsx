import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Loader2, ImagePlus, XCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

  // 🔹 Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get( import.meta.env.VITE_BACK + "/api/product/getAll-products", {
        withCredentials: true,
      });
      if (res.data.success) setProducts(res.data.product);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Open Delete Confirmation Modal
  const confirmDelete = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  // 🔹 Delete product (with Cloudinary delete)
  const handleDelete = async () => {
    const { id } = deleteModal;
    if (!id) return;

    const toastId = toast.loading("Deleting product...");
    try {
      const res = await axios.delete( import.meta.env.VITE_BACK+ "/api/product/delete-products", {
        data: { productId: id },
        withCredentials: true,
      });

      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success("🗑 Product deleted successfully!", { id: toastId });
      } else {
        toast.error(res.data.message || "Failed to delete product", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during delete", { id: toastId });
    } finally {
      setDeleteModal({ open: false, id: null, name: "" });
    }
  };

  // 🔹 Open edit modal
  const handleEdit = (product) => {
    setEditing(product._id);
    setFormData({ ...product });
    setPreviewImage(product.images?.[0] || "");
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle new image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, newImage: file });
    const preview = URL.createObjectURL(file);
    setPreviewImage(preview);
  };

  // 🔹 Save changes (Cloudinary-compatible)
  const handleSave = async () => {
    if (!editing) return;
    const toastId = toast.loading("Updating product...");
    setSaving(true);

    try {
      const data = new FormData();
      data.append("productId", editing);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      if (formData.newImage) data.append("images", formData.newImage);

      const res = await axios.put( import.meta.env.VITE_BACK + "/api/product/update-products", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("✅ Product updated successfully!", { id: toastId });
        setProducts((prev) =>
          prev.map((p) => (p._id === editing ? res.data.updatedProduct : p))
        );
        setEditing(null);
        setFormData({});
        setPreviewImage("");
      } else {
        toast.error(res.data.message || "Update failed", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during update", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          🛍 Manage Products
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-600 text-center">No products found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-md p-4 relative hover:shadow-lg transition"
              >
                <img
                  src={p.images?.[0] || "https://via.placeholder.com/150"}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
                <p className="mt-2 font-medium">₹{p.price}</p>
                <p className="text-sm text-gray-600">📦 Stock: {p.stock}</p>
                <p className="text-sm text-gray-600">🏷 Category: {p.category}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(p._id, p.name)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">✏️ Edit Product</h3>

              <div className="space-y-3">
                {["name", "description", "price", "category", "stock"].map((field) => (
                  <input
                    key={field}
                    type={field === "price" || field === "stock" ? "number" : "text"}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ))}

                {/* 🔸 Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <div className="flex items-center gap-3">
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    )}
                    <label className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm">
                      <ImagePlus size={16} />
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🧩 Delete Confirmation Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
              <XCircle className="mx-auto text-red-500" size={50} />
              <h3 className="text-lg font-semibold mt-4">
                Delete “{deleteModal.name}”?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                This action cannot be undone. Are you sure?
              </p>

              <div className="flex justify-center gap-3 mt-5">
                <button
                  onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default ManageProducts;
