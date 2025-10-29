import React, { useEffect, useState } from "react";
import {
  Loader2,
  User,
  MapPin,
  Package,
  Calendar,
  TrendingUp,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import api from "../api";

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/order/all");
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error("Error fetching all orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600 mb-3 sm:w-12 sm:h-12" />
        <p className="text-gray-600 text-base sm:text-lg">Loading orders...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex justify-center sm:justify-start items-center gap-2 sm:gap-3">
                <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
                Order Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Track and manage all customer orders
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
                <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-600">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-lg sm:text-xl text-gray-500">No orders found</p>
            <p className="text-gray-400 text-sm sm:text-base mt-1 sm:mt-2">
              Orders will appear here once customers place them
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                          #{order._id.slice(-8).toUpperCase()}
                        </h2>
                        <p className="text-indigo-100 text-xs sm:text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border-2 ${getStatusColor(
                        order.status
                      )} capitalize`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-4 sm:p-6">
                  {/* Customer & Address */}
                  <div className="grid md:grid-cols-2 gap-4 mb-5 sm:mb-6">
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          Customer Details
                        </p>
                      </div>
                      <p className="text-gray-800 font-medium text-sm sm:text-base break-all">
                        {order.userId?.name}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm break-all">
                        {order.userId?.email}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                            Shipping Address
                          </p>
                          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">
                            {order.shippingAddress?.fullName}
                            <br />
                            {order.shippingAddress?.addressLine1}
                            <br />
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state} -{" "}
                            {order.shippingAddress?.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-5 sm:mb-6 overflow-x-auto">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Order Items
                      </h3>
                    </div>
                    <div className="space-y-3 min-w-[300px]">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <img
                            src={item.productId?.images?.[0] || "/noimage.png"}
                            alt={item.productId?.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm mx-auto sm:mx-0"
                          />
                          <div className="flex-1 text-center sm:text-left min-w-0">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {item.productId?.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              Qty:{" "}
                              <span className="font-medium">
                                {item.quantity}
                              </span>{" "}
                              × ₹
                              {item.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 text-base sm:text-lg text-center sm:text-right">
                            ₹
                            {(item.quantity * item.price).toLocaleString(
                              "en-IN",
                              { minimumFractionDigits: 2 }
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Payment Summary
                      </h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span className="font-medium">
                          ₹{order.subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>GST (5%)</span>
                        <span className="font-medium">
                          ₹{order.gstAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping Charges</span>
                        <span className="font-medium">
                          ₹{order.shippingCharges.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="border-t-2 border-indigo-200 pt-2 sm:pt-3 flex justify-between text-base sm:text-lg">
                        <span className="font-bold text-gray-900">
                          Total Amount
                        </span>
                        <span className="font-bold text-indigo-600">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllOrders;
