import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const user = JSON.parse(localStorage.getItem("user")); // lấy user hiện tại
  const { toggleFavorite, isFavorite } = useFavorites();

  // 🩷 Xử lý khi nhấn vào biểu tượng tim
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user || !user.id) {
      alert("Vui lòng đăng nhập để thêm sản phẩm yêu thích!");
      return;
    }

    toggleFavorite(product, user.id); // truyền đúng user.id vào context
  };

  return (
    <div className="product-card">
      {/* ❤️ Nút yêu thích */}
      <div
        className="favorite-btn"
        title={user ? "Thêm vào yêu thích" : "Đăng nhập để lưu sản phẩm"}
        onClick={handleFavoriteClick}
      >
        <Heart
          className={`heart-icon ${
            isFavorite(product.id, user?.id) ? "active" : ""
          }`}
        />
      </div>

      {/* 🖼 Hình sản phẩm */}
      <Link to={`/product/${product.id}`} className="product-image">
        <img
          src={
            product.images?.length
              ? product.images[0]
              : "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={product.name}
        />
      </Link>

      {/* 🏷 Thông tin sản phẩm */}
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{product.price.toLocaleString()}₫</p>
        <button className="add-btn" onClick={() => onAddToCart(product)}>
          🛒 Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
