import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import AdminProducts from "./AdminProducts";

const API_URL = "http://localhost:3001/api/orders";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("orders");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    delivered: 0,
    preparing: 0,
  });

  /* =========================
     LOAD ORDERS
  ========================= */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Không thể tải đơn hàng");

      const data = await res.json();
      setOrders(data);
      calculateStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     CALCULATE STATS
  ========================= */
  const calculateStats = (list) => {
    setStats({
      totalOrders: list.length,
      totalRevenue: list.reduce((s, o) => s + (Number(o.total) || 0), 0),
      delivered: list.filter((o) => o.deliveryStatus === "delivered").length,
      preparing: list.filter(
        (o) =>
          o.deliveryStatus === "preparing" ||
          o.deliveryStatus === "delivering"
      ).length,
    });
  };

  /* =========================
     UPDATE ORDER STATUS (FIX)
  ========================= */
  const handleChangeStatus = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return alert("Không tìm thấy đơn hàng!");

    let nextStatus = "preparing";
    if (order.deliveryStatus === "preparing") nextStatus = "delivering";
    if (order.deliveryStatus === "delivering") nextStatus = "delivered";

    const updatedOrder = {
      ...order,
      status: nextStatus,
      deliveryStatus: nextStatus,
    };

    try {
      const res = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT", // ❗ PUT thay vì PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();

      const newOrders = orders.map((o) =>
        o.id === orderId ? data : o
      );

      setOrders(newOrders);
      calculateStats(newOrders);

      alert(`✅ Đã cập nhật đơn #${orderId}`);
    } catch (err) {
      console.error(err);
      alert("❌ Không thể cập nhật trạng thái!");
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="admin-dashboard">
      <main className="admin-content">
        {view === "orders" ? (
          <>
            <h2>Quản lý đơn hàng</h2>

            <div className="stats-container">
              <div className="stat-card">
                <h3>Tổng đơn</h3>
                <p>{stats.totalOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Doanh thu</h3>
                <p>{stats.totalRevenue.toLocaleString()} ₫</p>
              </div>
              <div className="stat-card">
                <h3>Đã giao</h3>
                <p>{stats.delivered}</p>
              </div>
              <div className="stat-card">
                <h3>Đang xử lý</h3>
                <p>{stats.preparing}</p>
              </div>
            </div>

            <div className="orders-container">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <h3>Mã đơn: #{order.id}</h3>
                  <p><b>Khách:</b> {order.userName}</p>
                  <p><b>Địa chỉ:</b> {order.address}</p>
                  <p><b>Điện thoại:</b> {order.phone}</p>

                  <p>
                    <b>Trạng thái:</b>{" "}
                    <span className={`status-label ${order.deliveryStatus}`}>
                      {order.deliveryStatus === "preparing"
                        ? "Chuẩn bị hàng"
                        : order.deliveryStatus === "delivering"
                        ? "Đang giao"
                        : "Đã giao"}
                    </span>
                  </p>

                  <div className="order-items">
                    {order.items?.map((item, i) => (
                      <div key={i} className="order-item">
                        <img src={item.image} alt={item.name} />
                        <div>
                          <p>{item.name}</p>
                          <p>Số lượng: {item.quantity}</p>
                          <p>{item.price.toLocaleString()} ₫</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="order-total">
                    Tổng: <b>{order.total?.toLocaleString()} ₫</b>
                  </p>

                  {order.deliveryStatus !== "delivered" && (
                    <button
                      className="btn-update"
                      onClick={() => handleChangeStatus(order.id)}
                    >
                      Cập nhật trạng thái
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <AdminProducts />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
