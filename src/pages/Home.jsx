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

  // ✅ Pagination state
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

  // ✅ Lọc sản phẩm
  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const price = Number(p.price);
    const matchMin = minPrice === "" || price >= Number(minPrice);
    const matchMax = maxPrice === "" || price <= Number(maxPrice);
    const matchGender = !filter?.gender || p.gender === filter.gender;
    const matchCategory = !filter?.category || p.category === filter.category;
    return matchName && matchMin && matchMax && matchGender && matchCategory;
  });

  // ✅ Reset trang khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [search, minPrice, maxPrice, filter]);

  // ✅ Tính danh sách sản phẩm theo trang
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / productsPerPage);

  return (
    <div className="home-container">
      <Banner />

      <h2 style={{ marginTop: "20px" }}>
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

      {/* 🔍 Thanh lọc */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Tìm kiếm tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Giá từ..."
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Giá đến..."
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* 🛍️ Sản phẩm */}
      {loading ? (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Đang tải sản phẩm...
        </p>
      ) : filtered.length > 0 ? (
        <>
          <div className="product-grid">
            {currentProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>

          {/* ✅ Phân trang */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              « Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Sau »
            </button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", marginTop: "40px", color: "#888" }}>
          Không tìm thấy sản phẩm phù hợp
        </p>
      )}

      {/* 📰 Blog */}
      <section className="home-blogs">
        <h2>Tin tức nổi bật</h2>
        <div className="blog-preview-list">
          {blogs.slice(0, 3).map((b) => (
            <div key={b.id} className="blog-card">
              <img src={b.image} alt={b.title} />
              <div className="blog-info">
                <h3>{b.title}</h3>
                <p>{b.content.slice(0, 100)}...</p>
                <Link to={`/blog/${b.id}`} className="read-more">
                  Đọc thêm →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>Shop Sport</h3>
            <p>
              Nơi mang đến cho bạn sản phẩm thể thao phong cách & chất lượng!
            </p>
          </div>

          <div className="footer-section contact">
            <h4>Liên hệ</h4>
            <p>48 Nguyễn Hữu Thọ, Hoàng Mai, Hà Nội</p>
            <p>0359811596</p>
            <p>vuongtn1006@gmail.com</p>
          </div>

          <div className="footer-section links">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/favorites">Yêu thích</Link></li>
              <li><Link to="/orders">Đơn hàng</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Shop Sport — Tự tin, phong cách, thể thao mỗi ngày</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
