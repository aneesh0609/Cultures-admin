import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Define routes inside the menuItems properly
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/" },
    { icon: <Package size={20} />, label: "Products", path: "/products" },
    { icon: <ShoppingBag size={20} />, label: "Orders", path: "/orders" },
    { icon: <Users size={20} />, label: "Customers", path: "/customers" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
        onClick={() => setOpen(!open)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 p-5 flex flex-col transition-transform z-40 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="text-2xl font-bold mb-6">ShopAdmin</div>

        {/* Navigation Buttons */}
        <nav className="flex-1 flex flex-col gap-3">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)} // ✅ Navigate on click
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition text-left"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-md transition">
          <LogOut size={20} /> Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
