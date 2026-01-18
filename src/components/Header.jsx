import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaClipboardList } from "react-icons/fa"; // 🛒 ❤️ 📋
import "./Header.css";

const Header = ({ cartCount, setFilter, user, setUser }) => {
  const [showMen, setShowMen] = useState(false);
  const [showWomen, setShowWomen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleCategorySelect = (gender, category) => {
    setFilter({ gender, category });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ==========================================
     ✅ GIAO DIỆN ADMIN HEADER
     ========================================== */
  if (location.pathname.startsWith("/admin")) {
    return (
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>
             <span>Admin Dashboard</span>
          </h1>

          <div className="admin-header-nav">
            <button
              className={
                location.pathname === "/admin/orders" ||
                location.pathname === "/admin"
                  ? "active"
                  : ""
              }
              onClick={() => navigate("/admin")}
            >
              Đơn hàng
            </button>

            <button
              className={
                location.pathname === "/admin/products" ? "active" : ""
              }
              onClick={() => navigate("/admin/products")}
            >
              Sản phẩm
            </button>

            <button
              className={
                location.pathname === "/admin/vouchers" ? "active" : ""
              }
              onClick={() => navigate("/admin/vouchers")}
            >
              Voucher
            </button>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </header>
    );
  }

  /* ==========================================
     🛍️ GIAO DIỆN HEADER NGƯỜI DÙNG
     ========================================== */
  return (
    <header className="header">
      <Link to="/" className="logo" onClick={() => setFilter(null)}>
        Shop Sport
      </Link>

      <nav className="nav">
        <Link to="/" onClick={() => setFilter(null)}>
          Trang chủ
        </Link>

        {/* Dropdown Nam */}
        <div
          className="dropdown"
          onMouseEnter={() => setShowMen(true)}
          onMouseLeave={() => setShowMen(false)}
        >
          <span className="menu-item">Nam ▾</span>
          {showMen && (
            <div className="dropdown-menu">
              <span onClick={() => handleCategorySelect("men", "clothes")}>
                Quần áo nam
              </span>
              <span onClick={() => handleCategorySelect("men", "shoes")}>
                Giày nam
              </span>
              <span onClick={() => handleCategorySelect("men", "accessories")}>
                Phụ kiện nam
              </span>
            </div>
          )}
        </div>

        {/* Dropdown Nữ */}
        <div
          className="dropdown"
          onMouseEnter={() => setShowWomen(true)}
          onMouseLeave={() => setShowWomen(false)}
        >
          <span className="menu-item">Nữ ▾</span>
          {showWomen && (
            <div className="dropdown-menu">
              <span onClick={() => handleCategorySelect("women", "clothes")}>
                Quần áo nữ
              </span>
              <span onClick={() => handleCategorySelect("women", "shoes")}>
                Giày nữ
              </span>
              <span
                onClick={() => handleCategorySelect("women", "accessories")}
              >
                Phụ kiện nữ
              </span>
            </div>
          )}
        </div>

        {/* 🛒 Icon giỏ hàng */}
        <Link to="/cart" className="icon-link" title="Giỏ hàng">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {/* 📋 Icon đơn hàng */}
        <Link to="/orders" className="icon-link" title="Đơn hàng">
          <FaClipboardList />
        </Link>

        {/* ❤️ Icon yêu thích */}
        <Link to="/favorites" className="icon-link" title="Yêu thích">
          <FaHeart />
        </Link>

        {/* Khi đã đăng nhập */}
        {user ? (
          <div
            className="user-dropdown"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <span className="user-name">{user.name} ▾</span>
            {showUserMenu && (
              <div className="dropdown-menu">
                <span onClick={handleLogout}>Đăng xuất</span>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
