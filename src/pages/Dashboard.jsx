import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { ShoppingBag, Users, DollarSign, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />

      {/* Main Section */}
      <main className="flex-1 ml-0 lg:ml-64 min-h-screen flex flex-col">
        <Navbar />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Orders" value="1,245" icon={<ShoppingBag />} color="border-blue-500" />
            <StatCard title="Customers" value="563" icon={<Users />} color="border-green-500" />
            <StatCard title="Revenue" value="$23,480" icon={<DollarSign />} color="border-yellow-500" />
            <StatCard title="Growth" value="+15%" icon={<TrendingUp />} color="border-purple-500" />
          </div>

          {/* Example content */}
          <section className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <p className="text-gray-500 text-sm">This section will show your recent orders.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
