import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { ShoppingBag, Users, DollarSign, TrendingUp } from "lucide-react";
import api from "../api";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch customers and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          api.get("/user/getusers"),
          api.get("/order/all"),
        ]);

        const usersData = usersRes.data.users || usersRes.data;
        const ordersData = ordersRes.data.orders || ordersRes.data;

        setUsers(usersData);
        setOrders(ordersData);

        // Calculate total revenue
        const totalRevenue = ordersData.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
        setRevenue(totalRevenue);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalOrders = orders.length;
  const totalUsers = users.length;
  const growthRate = Math.min(((totalOrders / (totalUsers || 1)) * 10).toFixed(1), 100);

  const recentOrders = orders
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-l from-slate-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <main className="flex-1 min-h-screen flex flex-col lg:ml-64">

        <div className="p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 text-sm sm:text-base text-center sm:text-right">
              Insights of users, orders, and overall performance
            </p>
          </div>

          {/* Stats Section */}
          {loading ? (
            <div className="text-center py-8 text-slate-500">
              Loading dashboard data...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                title="Total Orders"
                value={totalOrders}
                icon={<ShoppingBag />}
                color="border-blue-500"
              />
              <StatCard
                title="Customers"
                value={totalUsers}
                icon={<Users />}
                color="border-green-500"
              />
              <StatCard
                title="Revenue"
                value={`₹${revenue.toLocaleString()}`}
                
                color="border-yellow-500"
              />
              <StatCard
                title="Growth"
                value={`${growthRate}%`}
                icon={<TrendingUp />}
                color="border-purple-500"
              />
            </div>
          )}

          {/* Recent Orders */}
          <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-slate-800">
              Recent Orders
            </h2>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-3 rounded-l-lg">Order ID</th>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="p-3 font-medium text-slate-800 break-all">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="p-3 text-slate-700 font-medium whitespace-nowrap">
                          {order.user?.name || "Unknown User"}
                        </td>
                        <td className="p-3 text-slate-700 font-medium whitespace-nowrap">
                          ₹{order.totalAmount}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                              order.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No recent orders found.</p>
            )}
          </section>

          {/* All Orders Overview */}
          <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-slate-800">
              All Orders Summary
            </h2>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-slate-700 text-sm sm:text-base">
              <div>
                <span className="font-semibold text-slate-900">Delivered:</span>{" "}
                {orders.filter((o) => o.status === "Delivered").length}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Pending:</span>{" "}
                {orders.filter((o) => o.status === "Pending").length}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Cancelled:</span>{" "}
                {orders.filter((o) => o.status === "Cancelled").length}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
