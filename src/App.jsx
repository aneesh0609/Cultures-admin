import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateProduct from "./components/CreateProduct";
import { Toaster } from "react-hot-toast";
import Product from "./pages/Product";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Product />} />
          <Route path="/create-product" element={<CreateProduct />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
