import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import ProductCard from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import Footer from "./component/Footer";
import AddCategoryPage from "./pages/AddCategoryPage";
import AddProductPage from "./pages/AddProductPage";
import ViewProductPage from "./pages/ViewProductPage";
import ProfileUpdatePage from "./pages/ProfileUpdatePage";
import PageNotFound from "./pages/PageNotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DeletePage from "./pages/DeletePage";
import { useIdleTimer } from "react-idle-timer";
import { useDispatch } from "react-redux";
import { logout } from "./app/slice/userSlice";

const INACTIVITY_LIMIT = 5 * 60 * 1000;

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();

  useIdleTimer({
    timeout: INACTIVITY_LIMIT,
    onIdle: () => {
      const lastActive = localStorage.getItem("lastActiveTime");
      const now = Date.now();

      if (lastActive && now - parseInt(lastActive) >= INACTIVITY_LIMIT) {
        localStorage.clear();
        sessionStorage.clear();
        dispatch(logout());
      }
    },
    crossTab: true,
    debounce: 500,
  });

  useEffect(() => {
    const handleTabClose = () => {
      localStorage.setItem("lastActiveTime", Date.now().toString());
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, []);

  useEffect(() => {
    const lastActive = localStorage.getItem("lastActiveTime");
    const now = Date.now();

    if (loginStatus === "true") {
      if (lastActive && now - parseInt(lastActive) < INACTIVITY_LIMIT) {
        localStorage.setItem("lastActiveTime", now.toString());
      } else {
        localStorage.clear();
        sessionStorage.clear();
        dispatch(logout());
      }
    }
  }, []);

  const handleAddToCart = (product, quantity) => {
    setCartItems((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                selected: true,
              }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity, selected: true }];
      }
    });
  };

  return (
    <Router>
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/profile-update" element={<ProfileUpdatePage />} />
        <Route path="/delete" element={<DeletePage />} />
        <Route
          path="/"
          element={<ProductCard onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={
            <CartPage cartItems={cartItems} onCartUpdate={setCartItems} />
          }
        />
        <Route path="/view-product" element={<ViewProductPage />} />
        <Route path="/add-category" element={<AddCategoryPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;
