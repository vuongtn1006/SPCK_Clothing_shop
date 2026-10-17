import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});


API.login = (email, password) =>
  API.post("/login", { email, password });

API.register = (name, email, password) =>
  API.post("/register", { name, email, password });


API.getProducts = () => API.get("/products");

API.getProductById = (id) =>
  API.get(`/products/${id}`);


API.getReviews = (productId) =>
  API.get("/reviews", { params: { productId } });

API.addReview = (data) =>
  API.post("/reviews", data);


API.getOrders = (userId) =>
  API.get("/orders", { params: { userId } });

API.createOrder = (data) =>
  API.post("/orders", data);


API.getFavorites = (userId) =>
  API.get("/favorites", { params: { userId } });

API.addFavorite = (data) =>
  API.post("/favorites", data);

API.removeFavorite = (id) =>
  API.delete(`/favorites/${id}`);


API.getBlogs = () => API.get("/blogs");

API.getBlogById = (id) =>
  API.get(`/blogs/${id}`);


API.getVouchers = () => API.get("/vouchers");

export default API;
