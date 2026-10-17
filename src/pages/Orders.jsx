import React, { useEffect, useState } from "react";
import "./OrdersPage.css";
import API from "../api";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [35, 35],
});

const warehouseCoords = [21.028511, 105.804817];

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
  try {

    const userId = user?._id || user?.id;

    if (!userId) {
      console.log("Không tìm thấy userId");
      return;
    }

    const res = await API.get(`/orders?userId=${userId}`);

    setOrders(res.data.reverse());

  } catch (err) {
    console.error("Lỗi khi tải đơn hàng:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading)
    return <p className="loading">Đang tải danh sách đơn hàng...</p>;

  if (!user)
    return (
      <div className="orders-empty">
        <h2>Bạn cần đăng nhập để xem đơn hàng!</h2>
        <a href="/login" className="login-btn">
          Đăng nhập ngay
        </a>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="orders-empty">
        <h2>Bạn chưa có đơn hàng nào</h2>
        <a href="/" className="continue-btn">
          Tiếp tục mua sắm
        </a>
      </div>
    );

  return (
    <div className="orders-container">
      <h1>Đơn hàng của tôi </h1>

      {orders.map((order) => (
        <OrderCard key={order._id || order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  const customerCoords = order.coords || [21.001, 105.82];
  const [progress, setProgress] = useState(0);
  const [currentPos, setCurrentPos] = useState(warehouseCoords);

  useEffect(() => {
    if (!customerCoords) return;

    if (order.deliveryStatus === "delivered") {
      setProgress(1);
      setCurrentPos(customerCoords);
      return;
    }

    const interval = setInterval(() => {
      setProgress((p) => (p + 0.02 >= 1 ? 1 : p + 0.02));
    }, 800);

    return () => clearInterval(interval);
  }, [customerCoords, order.deliveryStatus]);

  useEffect(() => {
    if (!customerCoords) return;

    const [lat1, lng1] = warehouseCoords;
    const [lat2, lng2] = customerCoords;

    const lat = lat1 + (lat2 - lat1) * progress;
    const lng = lng1 + (lng2 - lng1) * progress;

    setCurrentPos([lat, lng]);
  }, [progress, customerCoords]);

  const getStatusLabel = () => {
    switch (order.deliveryStatus) {
      case "preparing":
        return "Chuẩn bị hàng";
      case "delivering":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao thành công";
      default:
        return "Đang giao hàng";
    }
  };

  const getStatusColor = () => {
    switch (order.deliveryStatus) {
      case "preparing":
        return "#999";
      case "delivering":
        return "orange";
      case "delivered":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <h3>Mã đơn hàng: #{order._id}</h3>
        <p>
          <strong>Ngày đặt:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="order-shipping">
        <p>
          <strong>Địa chỉ:</strong> {order.address}
        </p>
        <p>
          <strong>Điện thoại:</strong> {order.phone}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          <span style={{ color: getStatusColor(), fontWeight: "600" }}>
            {getStatusLabel()}
          </span>
        </p>
      </div>

      <div className="order-items">
        {order.items?.map((item, i) => (
          <div key={i} className="order-item">
            <img
              src={
                item.image && item.image.trim() !== ""
                  ? item.image
                  : "https://via.placeholder.com/120x120?text=No+Image"
              }
              alt={item.name}
            />

            <div>
              <p className="name">{item.name}</p>
              <p className="qty">Số lượng: {item.quantity}</p>
              <p className="price">
                Giá: {Number(item.price).toLocaleString()} ₫
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-footer">
        <p>
          <strong>Tổng tiền:</strong>{" "}
          <span className="total">
            {Number(order.total).toLocaleString()} ₫
          </span>
        </p>
      </div>

      {customerCoords && order.deliveryStatus !== "delivered" && (
        <div className="order-map">
          <h4>Lộ trình giao hàng:</h4>

          <MapContainer
            center={warehouseCoords}
            zoom={13}
            scrollWheelZoom={false}
            style={{
              height: "250px",
              width: "100%",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Polyline
              positions={[warehouseCoords, customerCoords]}
              color="blue"
            />

            <Marker position={warehouseCoords}>
              <Popup>Kho hàng:</Popup>
            </Marker>

            <Marker position={currentPos} icon={deliveryIcon}>
              <Popup>
                Đang giao hàng...
                <br />
                Tiến trình: {(progress * 100).toFixed(0)}%
              </Popup>
            </Marker>

            <Marker position={customerCoords}>
              <Popup>Địa chỉ khách hàng:</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {order.deliveryStatus === "delivered" && (
        <p style={{ color: "green", fontWeight: "600", marginTop: "10px" }}>
          Đơn hàng đã giao thành công!
        </p>
      )}
    </div>
  );
}