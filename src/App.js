import { useState } from "react";
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
import UpdateProfile from "./pages/UpdateProfile";
import ViewProductPage from "./pages/ViewProductPage";
const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product, quantity) => {
    setCartItems((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                selected: true, // optional: reselect if added again
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
        <Route path="/update-profile/:id" element={<UpdateProfile />} />
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
        <Route path="/view-product/:id" element={<ViewProductPage />} />
        <Route path="/add-category" element={<AddCategoryPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;
