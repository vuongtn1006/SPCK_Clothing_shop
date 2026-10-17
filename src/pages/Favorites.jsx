import React, { useEffect, useState } from "react";
import API from "../api";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import "./Favorites.css"; 

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (favorites.length > 0) {
      Promise.all(favorites.map((f) => API.get(`/products/${f.productId}`)))
        .then((res) => setProducts(res.map((r) => r.data)))
        .catch((err) =>
          console.error("Lỗi khi tải sản phẩm yêu thích:", err.message)
        );
    } else {
      setProducts([]);
    }
  }, [favorites]);

  const handleRemove = (product) => {
    if (window.confirm(`Xoá "${product.name}" khỏi danh sách yêu thích?`)) {
      toggleFavorite(product);
    }
  };

  return (
    <div className="favorites-page">
      <h2>Sản phẩm yêu thích của bạn</h2>

      {products.length === 0 ? (
        <p className="no-favorites">
          Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
        </p>
      ) : (
        <div className="favorites-grid">
          {products.map((p) => (
            <div key={p._id} className="favorite-card">
              {/* 🗑 Nút xoá */}
              <button
                onClick={() => handleRemove(p)}
                className="remove-btn"
                title="Xoá khỏi yêu thích"
              >
                <Trash2 size={20} />
              </button>

              <Link to={`/product/${p.id}`} className="fav-image">
                <img
                  src={
                    p.images?.[0] ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={p.name}
                />
              </Link>

              <div className="fav-info">
                <h3>{p.name}</h3>
                <p className="fav-price">{p.price?.toLocaleString()}₫</p>
                <Link to={`/product/${p._id}`} className="fav-btn">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
