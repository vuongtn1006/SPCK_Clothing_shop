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


  const fetchData = async () => {
    try {

      // product
      const prodRes = await API.get(`/products/${id}`);
      const prod = prodRes.data;

      if (!prod) return;

      setProduct(prod);

      const firstImg =
        prod.images?.[0] ||
        prod.image ||
        "https://via.placeholder.com/400x300?text=No+Image";

      setMainImage(firstImg);

      // reviews
      const revRes = await API.get(`/reviews?productId=${id}`);
      setReviews(revRes.data);

      // related products
      const allProductsRes = await API.get(`/products`);

      const related = allProductsRes.data
        .filter(
          (p) =>
            p.category === prod.category &&
            p._id !== prod._id
        )
        .slice(0, 4);

      setRelatedProducts(related);

    } catch (err) {
      console.error("Lỗi load product detail:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* ==============================
     SUBMIT REVIEW
  ============================== */

  const submitReview = async (rating, comment) => {

    if (!user) {
      alert("Bạn cần đăng nhập để đánh giá!");
      return;
    }

    try {

      const payload = {
        productId: id,
        userId: user._id,
        userName: user.name,
        rating,
        comment,
      };

      await API.post("/reviews", payload);

      fetchData();

    } catch (err) {
      console.error("Lỗi gửi review:", err);
    }
  };

  /* ==============================
     ADD TO CART
  ============================== */

  const handleAddToCart = () => {

    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return;
    }

    addToCart({
      ...product,
      selectedSize,
    });

    alert(
      `Đã thêm ${product.name} (${selectedSize || "Free Size"}) vào giỏ!`
    );
  };

  /* ==============================
     RATING
  ============================== */

  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviews.length
      ).toFixed(1)
    : "Chưa có";

  if (!product) {
    return (
      <div className="product-notfound">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  /* ==============================
     UI
  ============================== */

  return (
    <div className="product-detail-container">

      {/* PRODUCT MAIN */}

      <div className="product-main">

        {/* IMAGE */}

        <div className="product-image-section">

          <img
            src={mainImage}
            alt={product.name}
            className="product-main-image"
          />

          {product.images?.length > 1 && (

            <div className="thumbnail-gallery">

              {product.images.map((img, i) => (

                <img
                  key={i}
                  src={img}
                  className={`thumbnail ${
                    mainImage === img ? "active" : ""
                  }`}
                  onClick={() => setMainImage(img)}
                  alt=""
                />

              ))}

            </div>

          )}

        </div>

        {/* INFO */}

        <div className="product-info-section">

          <h1>{product.name}</h1>

          <p className="price">
            {product.price?.toLocaleString()}₫
          </p>

          <p className="desc">{product.description}</p>

          {/* SIZE */}

          {product.sizes?.length > 0 && (

            <div className="size-selector">

              <label>Chọn size:</label>

              <div className="size-options">

                {product.sizes.map((size) => (

                  <button
                    key={size}
                    className={`size-btn ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>

                ))}

              </div>

            </div>

          )}

         

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            🛒 Thêm vào giỏ hàng
          </button>

        

          <div className="rating-display">
            ⭐ Đánh giá trung bình:
            <b> {avgRating} </b>
            ({reviews.length} đánh giá)
          </div>

        </div>

      </div>

      

      <div className="product-review-section">

        <h2>Đánh giá sản phẩm</h2>

        <ReviewList reviews={reviews} />

        <h3>Viết đánh giá</h3>

        <ReviewForm onSubmit={submitReview} />

      </div>


      <div className="related-products-container">

        <h2>Sản phẩm liên quan</h2>

        <div className="related-products-grid">

          {relatedProducts.map((item) => (

            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="related-product-card"
            >

              <img
                src={
                  item.images?.[0] ||
                  item.image ||
                  "https://via.placeholder.com/400x300"
                }
                alt={item.name}
              />

              <p className="rp-name">{item.name}</p>

              <p className="rp-price">
                {item.price?.toLocaleString()}₫
              </p>

            </Link>

          ))}

        </div>

      </div>

    </div>
  );
}