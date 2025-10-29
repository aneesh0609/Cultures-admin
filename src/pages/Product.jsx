import React, { useState } from "react";
import CreateProduct from "../components/CreateProduct";
import ManageProducts from "../components/ManageProducts";


const Product = () => {
  const [activeTab, setActiveTab] = useState("create");

  // ✅ Render content dynamically
  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateProduct />;
      case "Manage":
        return <ManageProducts />;
      default:
        return <CreateProduct />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:ml-64 transition-all">
      {/* Header */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 panchang">
        Product Management
      </h1>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { id: "create", label: "➕ Create Product" },
          { id: "Manage", label: " Manage Product" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Section */}
      <div className="bg-white rounded-xl shadow-md p-6">{renderContent()}</div>
    </div>
  );
};

export default Product;
