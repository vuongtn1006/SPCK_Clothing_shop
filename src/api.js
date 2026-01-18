import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================================================
   AUTH / USERS
====================================================== */
API.login = (email, password) =>
  API.post("/login", { email, password });

API.register = (name, email, password) =>
  API.post("/register", { name, email, password });

/* ======================================================
   PRODUCTS
====================================================== */
API.getProducts = () => API.get("/products");

API.getProductById = (id) =>
  API.get(`/products/${id}`);

/* ======================================================
   REVIEWS
====================================================== */
API.getReviews = (productId) =>
  API.get("/reviews", { params: { productId } });

API.addReview = (data) =>
  API.post("/reviews", data);

/* ======================================================
   ORDERS
====================================================== */
API.getOrders = (userId) =>
  API.get("/orders", { params: { userId } });

API.createOrder = (data) =>
  API.post("/orders", data);

/* ======================================================
   FAVORITES
====================================================== */
API.getFavorites = (userId) =>
  API.get("/favorites", { params: { userId } });

API.addFavorite = (data) =>
  API.post("/favorites", data);

API.removeFavorite = (id) =>
  API.delete(`/favorites/${id}`);

/* ======================================================
   BLOGS
====================================================== */
API.getBlogs = () => API.get("/blogs");

API.getBlogById = (id) =>
  API.get(`/blogs/${id}`);

/* ======================================================
   VOUCHERS
====================================================== */
API.getVouchers = () => API.get("/vouchers");

export default API;
