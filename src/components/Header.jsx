import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaClipboardList } from "react-icons/fa";
import "./Header.css";

const Header = ({ cartCount, setFilter, user, setUser }) => {
  const [showMen, setShowMen] = useState(false);
  const [showWomen, setShowWomen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 🌙 DARK MODE
  const [dark, setDark] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  /* =========================
     LOAD DARK MODE
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    if (dark) {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    }
    setDark(!dark);
  };

  const handleCategorySelect = (gender, category) => {
    setFilter({ gender, category });
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ==========================================
     ✅ ADMIN HEADER
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
                location.pathname === "/admin" ||
                location.pathname === "/admin/orders"
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

            <button
              className={
                location.pathname === "/admin/users" ? "active" : ""
              }
              onClick={() => navigate("/admin/users")}
            >
              Người dùng
            </button>
          </div>
        </div>

        <div className="theme-switch" onClick={toggleDark}>
  <div className={`switch ${dark ? "active" : ""}`}>
    <div className="circle"></div>
  </div>
</div>

          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        
      </header>
    );
  }

  /* ==========================================
    USER HEADER
  ========================================== */
  return (
    <header className="header">
      <Link to="/" className="logo" onClick={() => setFilter(null)}>
        Fashion Men
      </Link>

      <nav className="nav">
        <Link to="/" onClick={() => setFilter(null)}>
          Trang chủ
        </Link>

        {/* NAM */}
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

        <Link to="/cart" className="icon-link">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        <Link to="/orders" className="icon-link">
          <FaClipboardList />
        </Link>

        <Link to="/favorites" className="icon-link">
          <FaHeart />
        </Link>

        <div className="theme-switch" onClick={toggleDark}>
  <div className={`switch ${dark ? "active" : ""}`}>
    <div className="circle"></div>
  </div>
</div>

        {user ? (
          <div
            className="user-dropdown"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <span className="user-name">{user.name} ▾</span>

            {showUserMenu && (
              <div className="dropdown-menu">
                {user.role === "admin" && (
                  <span onClick={() => navigate("/admin")}>
                    Vào Admin
                  </span>
                )}
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