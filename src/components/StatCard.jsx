import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`p-5 bg-white rounded-2xl shadow hover:shadow-md transition border-t-4 ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm text-gray-500 font-medium">{title}</h2>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-gray-500">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
