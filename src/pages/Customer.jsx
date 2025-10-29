import React, { useEffect, useState } from "react";
import { Search, Phone, MapPin, Grid, List, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Fetch all users (without orders)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/getusers");
        const usersData = res.data.users || res.data;
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Fetch orders only when user clicks "View Orders"
  const handleViewOrders = async (userId) => {
    try {
      setOrdersLoading(true);
      setSelectedUser(users.find((u) => u._id === userId));
      setUserOrders([]);
      const res = await api.get(`/order/user/${userId}`);
      setUserOrders(res.data.orders || res.data);
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserOrders([]);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-lr from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="relative bg-white w-64">
            <Sidebar />
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 md:ml-64">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 p-2 bg-gray-900 text-white rounded-md"
        >
          ☰ Menu
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">All Users</h1>
        <p className="text-slate-600 mb-6">
          View user profiles and order history
        </p>

        {/* Search + View Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition ${
                viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-slate-200"
              }`}
            >
              <Grid className="w-5 h-5 text-slate-700" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition ${
                viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-slate-200"
              }`}
            >
              <List className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-600">No users found.</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={
                          user.avatar ||
                          "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                        }
                        alt={user.name}
                        className="w-14 h-14 rounded-full object-cover ring-4 ring-slate-100"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-slate-600 mb-4">
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{user.address}</span>
                        </div>
                      )}
                    </div>

                    {/* ✅ View Orders Button */}
                    <button
                      onClick={() => handleViewOrders(user._id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
                    >
                      View Orders
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {filteredUsers.map((user, index) => (
                  <div
                    key={user._id}
                    className={`p-6 transition ${
                      index !== filteredUsers.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            user.avatar ||
                            "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                          }
                          alt={user.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {user.name}
                          </h3>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {user.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {user.address || "Unknown"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => handleViewOrders(user._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        View Orders
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ✅ Modern & Responsive Orders Modal */}
        {selectedUser && (
          <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/40 transition-opacity duration-300">
            <div className="relative bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden transform transition-all scale-100 animate-fadeIn">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
              >
                <X size={22} />
              </button>

              {/* Header */}
              <div className="mb-5 border-b pb-3">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  🛍️ {selectedUser.name}'s Orders
                </h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>

              {/* Orders Section */}
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {ordersLoading ? (
                  <p className="text-center text-gray-500 py-6 animate-pulse">
                    Loading orders...
                  </p>
                ) : userOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">
                    No orders found for this user.
                  </p>
                ) : (
                  userOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-xl p-4 mb-4 bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                        <h3 className="text-sm font-semibold text-slate-800">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 sm:mt-0 ${
                            order.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="text-sm text-slate-600 space-y-1 mb-3">
                        <p>
                          <strong>Total:</strong> ₹{order.totalAmount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="bg-slate-50 rounded-lg p-3">
                        <h4 className="font-medium text-slate-800 text-sm mb-2">
                          Items:
                        </h4>
                        <ul className="divide-y divide-gray-200 text-sm">
                          {order.items?.map((item, i) => (
                            <li
                              key={i}
                              className="flex justify-between py-2 text-slate-700"
                            >
                              <span className="truncate max-w-[60%]">
                                {item.product?.name || "Product"}
                              </span>
                              <span className="font-medium">
                                ₹{item.price} × {item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
