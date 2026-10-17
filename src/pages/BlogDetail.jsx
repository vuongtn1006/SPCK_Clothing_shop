import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Blog.css";

const API_URL = "http://localhost:5000/api/blogs";

export default function BlogDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    // ❗ nếu id undefined thì không gọi API
    if (!id) {
      setError("Không tìm thấy bài viết");
      setLoading(false);
      return;
    }

    const fetchBlogDetail = async () => {
      try {

        console.log("BLOG ID:", id);

        const res = await fetch(`${API_URL}/${id}`);

        if (!res.ok) {
          throw new Error("Không tìm thấy bài viết");
        }

        const data = await res.json();

        console.log("BLOG DETAIL:", data);

        setPost(data);

      } catch (err) {

        console.error("❌ Lỗi tải chi tiết bài viết:", err);
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();

  }, [id]);

  if (loading) {
    return (
      <div className="blog-detail-container">
        <p className="loading">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-detail-container">
        <Link to="/blog" className="back-btn">
          ← Quay lại Blog
        </Link>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="blog-detail-container">

      <Link to="/blog" className="back-btn">
        ← Quay lại Blog
      </Link>

      <h1 className="blog-detail-title">
        {post.title}
      </h1>

      {post.date && (
        <p className="blog-detail-date">
          🕒 {new Date(post.date).toLocaleDateString("vi-VN")}
        </p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="blog-detail-img"
        />
      )}

      <div className="blog-detail-content">
        {post.content}
      </div>

    </div>
  );
}