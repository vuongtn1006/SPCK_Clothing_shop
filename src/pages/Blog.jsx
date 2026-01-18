import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blog.css";

/* ============================
   API EXPRESS BACKEND
============================ */
const API_URL = "http://localhost:3001/api/blogs";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ============================
     FETCH BLOG LIST
  ============================ */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("❌ Lỗi tải blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  /* ============================
     RENDER
  ============================ */
  if (loading) {
    return (
      <div className="blog-container">
        <h1 className="blog-title">Tin tức & Blog</h1>
        <p style={{ textAlign: "center", color: "#777" }}>
          Đang tải bài viết...
        </p>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <h1 className="blog-title">Tin tức & Blog</h1>

      {posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          Chưa có bài viết nào.
        </p>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <div key={post.id} className="blog-card">
              <img
                src={
                  post.image ||
                  "https://via.placeholder.com/400x250?text=No+Image"
                }
                alt={post.title}
                className="blog-thumb"
              />

              <div className="blog-info">
                <h2>{post.title}</h2>

                {post.date && (
                  <p className="blog-date">
                    🕒{" "}
                    {new Date(post.date).toLocaleDateString("vi-VN")}
                  </p>
                )}

                <p className="blog-desc">
                  {post.description?.length > 120
                    ? post.description.slice(0, 120) + "..."
                    : post.description}
                </p>

                <Link
                  to={`/blog/${post.id}`}
                  className="blog-readmore"
                >
                  Đọc thêm →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
