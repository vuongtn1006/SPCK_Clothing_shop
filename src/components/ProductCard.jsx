import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { toggleFavorite, isFavorite } = useFavorites();

  // ❤️ Click nút yêu thích
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user || !user._id) {
      alert("Vui lòng đăng nhập để thêm sản phẩm yêu thích!");
      return;
    }

    toggleFavorite(product);
  };

  return (
    <div className="product-card">

      {/* ❤️ Favorite */}
      <div
        className="favorite-btn"
        title={user ? "Thêm vào yêu thích" : "Đăng nhập để lưu sản phẩm"}
        onClick={handleFavoriteClick}
      >
        <Heart
          className={`heart-icon ${
            isFavorite(product._id) ? "active" : ""
          }`}
        />
      </div>

      {/* 🖼 Image + Link */}
      <Link to={`/product/${product._id}`} className="product-image">
        <img
          src={
            product.images?.length
              ? product.images[0]
              : product.image ||
                "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={product.name}
        />
      </Link>

      {/* 🏷 Product info */}
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{Number(product.price).toLocaleString()}₫</p>

        <button
          className="add-btn"
          onClick={() => onAddToCart(product)}
        >
          🛒 Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;