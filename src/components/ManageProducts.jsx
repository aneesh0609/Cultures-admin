import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Loader2} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/product/getAll-products");
        if (res.data.success) setProducts(res.data.product);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete("http://localhost:8000/api/product/delete-products", {
        data: { productId: id },
        withCredentials: true,
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Open edit modal
  const handleEdit = (product) => {
    setEditing(product._id);
    setFormData({ ...product });
  };

  // Handle input change in edit modal
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        "http://localhost:8000/api/product/update-products",
        { productId: editing, updates: formData },
        { withCredentials: true }
      );
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editing ? res.data.updatedProduct : p))
        );
        toast.success("Product updated successfully!");
        setEditing(null);
      }
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Sidebar />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛍 Manage Products</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-600 text-center">No products found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow-md p-4 relative">
              <img
                src={p.images || "https://via.placeholder.com/150"}
                alt={p.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
              <p className="mt-2 font-medium">💰 ₹{p.price}</p>
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
                  onClick={() => handleDelete(p._id)}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Product</h3>
            <div className="space-y-3">
              {["name", "description", "price", "category", "stock", "images"].map((field) => (
                <input
                  key={field}
                  type={field === "price" || field === "stock" ? "number" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  className="border p-2 rounded-md w-full"
                />
              ))}
            </div>

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
                {saving ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
