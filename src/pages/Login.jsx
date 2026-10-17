import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Auth.css";
import shopImage from "../assets/sportshop.png";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await API.login(email, password);

      // 🔧 CHUẨN HOÁ USER DATA
      const userData = res.data;

      if (!userData || !userData._id) {
        throw new Error("Dữ liệu user không hợp lệ");
      }

      const user = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role || "user",
      };

      // ✅ LƯU LOCALSTORAGE
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ SET STATE
      setUser(user);

      setMessage("🎉 Đăng nhập thành công!");

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 800);

    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        error.response?.data?.message || "Email hoặc mật khẩu không đúng!"
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
        <h2>Đăng nhập</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="switch-text">
          Chưa có tài khoản?{" "}
          <span onClick={() => navigate("/register")}>Đăng ký ngay</span>
        </p>
      </div>
    </div>
  );
};

export default Login;