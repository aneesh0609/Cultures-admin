import React from "react";
import { Bell, Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 bg-white shadow flex items-center justify-between px-6 py-3">
      <h1 className="text-xl font-semibold">Dashboard Overview</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <Bell className="text-gray-500 cursor-pointer" />
        <img
          src="/avatar.png"
          alt="Admin"
          className="w-9 h-9 rounded-full border border-gray-300"
        />
      </div>
    </header>
  );
};

export default Navbar;
