import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // axios instance (baseURL: http://localhost:3001/api)

export default function Checkout({ cart, clearCart, user }) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ===============================
     GUARD
  ================================ */
  if (!user)
    return (
      <div className="bg-white p-6 rounded shadow">
        Bạn cần{" "}
        <a className="text-indigo-600 underline" href="/login">
          đăng nhập
        </a>{" "}
        để thanh toán.
      </div>
    );

  if (!cart.length) return <div>Giỏ hàng rỗng.</div>;

  /* ===============================
     CALCULATE TOTAL
  ================================ */
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  /* ===============================
     PLACE ORDER
  ================================ */
  const placeOrder = async () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    const payload = {
      id: Date.now().toString(),          // đồng bộ với backend
      userId: String(user.id),
      userName: user.name,
      items: cart.map((item) => ({
        productId: String(item.productId),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "Free",
        image: item.image,
      })),
      total,
      address: address.trim(),
      paymentMethod: "COD",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setLoading(true);

    try {
      // GỌI EXPRESS API: POST /api/orders
      await API.post("/orders", payload);

      clearCart();
      navigate("/orders");

      alert("🎉 Đặt hàng thành công! Trạng thái: chờ xác nhận");
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("❌ Lỗi khi đặt hàng, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Thanh toán</h2>

      <div className="mb-3">
        Phương thức:{" "}
        <strong>Thanh toán khi nhận hàng (COD)</strong>
      </div>

      <div className="mb-3">
        Tổng tiền:{" "}
        <strong>{total.toLocaleString()}₫</strong>
      </div>

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Địa chỉ giao hàng"
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <button
        onClick={placeOrder}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </div>
  );
}
