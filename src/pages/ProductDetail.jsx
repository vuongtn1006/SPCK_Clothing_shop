import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import "./ProductDetail.css";

export default function ProductDetail({ addToCart, user }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // ✅ Load product + reviews
  const fetchData = async () => {
    try {
      const prodRes = await API.get(`/products/${id}`);
      setProduct(prodRes.data);

      const firstImg =
        prodRes.data.images?.length > 0 ? prodRes.data.images[0] : prodRes.data.image;
      setMainImage(firstImg);

      const revRes = await API.get(`/reviews?productId=${id}`);
      setReviews(revRes.data);

      // ✅ Fetch related products
      const allProducts = await API.get(`/products`);
      const related = allProducts.data
        .filter(
          (p) => p.category === prodRes.data.category && p.id !== prodRes.data.id
        )
        .slice(0, 4);

      setRelatedProducts(related);
    } catch {
      console.error("Lỗi load dữ liệu");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ✅ Submit review
  const submitReview = async (rating, comment) => {
    if (!user) {
      alert("Bạn cần đăng nhập để đánh giá!");
      return;
    }

    const payload = {
      productId: Number(id),
      userId: user.id,
      userName: user.name,
      rating,
      comment,
    };

    await API.post("/reviews", payload);
    fetchData(); // refresh reviews
  };

  if (!product)
    return <div className="product-notfound">Không tìm thấy sản phẩm</div>;

  // ✅ Average rating
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "Chưa có";

  // ✅ Add to cart (check size if available)
  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return;
    }
    addToCart({ ...product, selectedSize });
    alert(`Đã thêm ${product.name} (${selectedSize || "Free Size"}) vào giỏ!`);
  };

  return (
    <div className="product-detail-container">
      {/* Main product section */}
      <div className="product-main">
        <div className="product-image-section">
          <img src={mainImage} alt={product.name} className="product-main-image" />
          {product.images?.length > 1 && (
            <div className="thumbnail-gallery">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className={`thumbnail ${mainImage === img ? "active" : ""}`}
                  onClick={() => setMainImage(img)}
                  alt=""
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="price">{product.price.toLocaleString()}₫</p>
          <p className="desc">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="size-selector">
              <label>Chọn size:</label>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            🛒 Thêm vào giỏ hàng
          </button>

          <div className="rating-display">
            ⭐ Đánh giá trung bình: <b>{avgRating}</b> ({reviews.length} đánh giá)
          </div>
        </div>
      </div>

      {/* Review section */}
      <div className="product-review-section">
        <h2>Đánh giá sản phẩm</h2>
        <ReviewList reviews={reviews} />
        <h3>Viết đánh giá</h3>
        <ReviewForm onSubmit={submitReview} />
      </div>

      {/* ✅ Related products */}
      <div className="related-products-container">
        <h2>Sản phẩm liên quan</h2>
        <div className="related-products-grid">
          {relatedProducts.map((item) => (
            <Link key={item.id} to={`/product/${item.id}`} className="related-product-card">
              <img src={item.images ? item.images[0] : item.image} alt={item.name} />
              <p className="rp-name">{item.name}</p>
              <p className="rp-price">{item.price.toLocaleString()}₫</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
