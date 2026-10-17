import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blog.css";

/* ============================
   API EXPRESS BACKEND
============================ */
const API_URL = "http://localhost:5000/api/blogs";

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

        if (!res.ok) {
          throw new Error("Không thể tải blog");
        }

        const data = await res.json();

        console.log("BLOG DATA:", data); // debug

        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Lỗi tải blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  /* ============================
     LOADING
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

  /* ============================
     RENDER
  ============================ */
  return (
    <div className="blog-container">
      <h1 className="blog-title">Tin tức & Blog</h1>

      {posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          Chưa có bài viết nào.
        </p>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => {

  if (!post?._id) return null;

  return (
    <div key={post._id} className="blog-card">

      <img
        src={post.image || "https://via.placeholder.com/400x250"}
        alt={post.title}
        className="blog-thumb"
      />

      <div className="blog-info">

        <h2>{post.title}</h2>

        {post.date && (
          <p className="blog-date">
            🕒 {new Date(post.date).toLocaleDateString("vi-VN")}
          </p>
        )}

        <p className="blog-desc">
          {post.content?.slice(0,120)}...
        </p>

        <Link
          to={`/blog/${post._id}`}
          className="blog-readmore"
        >
          Đọc thêm →
        </Link>

      </div>
    </div>
  );

})}
        </div>
      )}
    </div>
  );
}