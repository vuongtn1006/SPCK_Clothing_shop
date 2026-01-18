import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Auth.css";
import shopImage from "../assets/sportshop.png";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ GỌI BACKEND EXPRESS
      const res = await API.register(name, email, password);
      const newUser = res.data; // ⭐ QUAN TRỌNG

      // ✅ LƯU USER
      localStorage.setItem("user", JSON.stringify(newUser));

      alert("🎉 Đăng ký thành công!");
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src={shopImage} alt="Shop Sport" />
      </div>

      <div className="auth-form">
        <h2>Đăng ký</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="switch-text">
          Đã có tài khoản?{" "}
          <span onClick={() => navigate("/login")}>Đăng nhập ngay</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
