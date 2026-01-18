import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Favorites from "./pages/Favorites";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AdminVouchers from "./pages/AdminVouchers";

import { useFavorites } from "./context/FavoritesContext";
import "leaflet/dist/leaflet.css";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation(); // để kiểm tra URL hiện tại

  // 🧩 Lấy dữ liệu ban đầu từ localStorage
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [filter, setFilter] = useState(null);
  const [message, setMessage] = useState("");
  const { favorites } = useFavorites();

  // 💾 Lưu cart & user vào localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // 🛒 Thêm sản phẩm vào giỏ
  const addToCart = (product, qty = 1) => {
    const selectedSize = product.selectedSize || "Free";
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.size === selectedSize
      );

      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.size === selectedSize
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.images?.[0] || "",
          size: selectedSize,
        },
      ];
    });

    navigate("/cart");
  };

  // 🧺 Cập nhật, xóa, làm trống giỏ hàng
  const updateCart = (productId, size, qty) =>
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity: qty } : i
      )
    );

  const removeFromCart = (productId, size) =>
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );

  const clearCart = () => setCart([]);

  // 🎉 Thông báo khi đăng nhập
  useEffect(() => {
    if (user) {
      setMessage(`Xin chào ${user.name}, bạn đã đăng nhập thành công!`);
      setTimeout(() => setMessage(""), 3000);
    }
  }, [user]);

  // ✅ Xác định khi nào ẩn Header
  const hideHeaderPaths = ["/login", "/register"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header cố định (ẩn ở login/register) */}
      {!shouldHideHeader && (
        <Header
          user={user}
          setUser={setUser}
          cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
          favoriteCount={favorites.length}
          setFilter={setFilter}
        />
      )}

      {/* 🌟 Thông báo */}
      {message && (
        <div
          style={{
            background: "#4caf50",
            color: "white",
            textAlign: "center",
            padding: "10px",
            fontWeight: "500",
            animation: "fadeInOut 3s ease",
          }}
        >
          {message}
        </div>
      )}

      {/* 📦 Các route chính */}
      <main className="container mx-auto px-4 py-6">
        <Routes>
          {/* 🏠 Trang chính */}
          <Route
            path="/"
            element={<Home addToCart={addToCart} filter={filter} user={user} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail addToCart={addToCart} user={user} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                updateCart={updateCart}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} clearCart={clearCart} user={user} />}
          />
          <Route path="/orders" element={<Orders user={user} />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          {/* 📰 Blog */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />

          {/* ⚙️ Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/vouchers" element={<AdminVouchers />} />
        </Routes>
      </main>

      {/* ✨ CSS animation */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
