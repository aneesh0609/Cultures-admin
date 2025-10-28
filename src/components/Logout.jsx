import api from "../api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Welcome Admin 👋</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
