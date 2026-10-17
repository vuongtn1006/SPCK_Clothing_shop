import React, { useState, useEffect } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";
import Banner from "../components/Banner";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = ({ addToCart, filter }) => {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    Promise.all([API.get("/products"), API.get("/blogs")])
      .then(([prodRes, blogRes]) => {
        setProducts(prodRes.data);
        setBlogs(blogRes.data);
      })
      .catch((err) => console.error("Lỗi tải dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const price = Number(p.price);
    const matchMin = minPrice === "" || price >= Number(minPrice);
    const matchMax = maxPrice === "" || price <= Number(maxPrice);
    const matchGender = !filter?.gender || p.gender === filter.gender;
    const matchCategory = !filter?.category || p.category === filter.category;
    return matchName && matchMin && matchMax && matchGender && matchCategory;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, minPrice, maxPrice, filter]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  return (
    <div className="home">

      <div className="hero">
        <Banner />
        <div className="hero-overlay">
        </div>
      </div>

      <div className="section-header">
        <h2>
          {filter
            ? `Danh mục: ${
                filter.gender === "men" ? "Nam" : "Nữ"
              } - ${
                filter.category === "clothes"
                  ? "Quần áo"
                  : filter.category === "shoes"
                  ? "Giày"
                  : "Phụ kiện"
              }`
            : "Tất cả sản phẩm"}
        </h2>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Giá từ"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Giá đến"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <div className="loading">Đang tải sản phẩm...</div>
      ) : filtered.length > 0 ? (
        <>
          <div className="product-grid">
            {currentProducts.map((p) => (
              <ProductCard key={p._id} product={p} onAddToCart={addToCart} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              →
            </button>
          </div>
        </>
      ) : (
        <p className="empty">Không tìm thấy sản phẩm</p>
      )}

      {/* BLOG */}
      <section className="blogs">
        <h2>Tin tức nổi bật</h2>
        <div className="blog-list">
          {blogs.slice(0, 3).map((b) => (
            <div key={b._id} className="blog-card">
              <img src={b.image} alt={b.title} />
              <div className="blog-content">
                <h3>{b.title}</h3>
                <p>{b.content.slice(0, 100)}...</p>
                <Link to={`/blog/${b._id}`}>Đọc thêm →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>Shop Sport</h3>
            <p>Phong cách & chất lượng</p>
          </div>

          <div>
            <h4>Liên hệ</h4>
            <p>chúng tôi ở địa chỉ 419 phan trọng tuệ ,Phường Thanh Liệt ,TP Hà Nội</p>

            <p>0359811596</p>
          </div>

          <div>
            <h4>Liên kết</h4> 
            <Link to="/">Trang chủ</Link>
            <Link to="/favorites">Yêu thích</Link>
            <Link to="/orders">Đơn hàng</Link>
          </div>
        </div>

        <p className="copyright">
          © 2026 Fashion Store
        </p>
      </footer>
    </div>
  );
};

export default Home;