import { useEffect, useState } from "react";
import { productCategoriApi, productListApi } from "../action/productApi";
import { Link } from "react-router-dom";

const ProductCard = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productQuantities, setProductQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productListApi();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productCategoriApi();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCategory(selectedId);

    if (selectedId === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category?.id?.toString() === selectedId
      );
      setFilteredProducts(filtered);
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) + delta, 0),
    }));
  };

  const handleAddToCart = (productId) => {
    const quantity = productQuantities[productId] || 0;
    const product = filteredProducts.find((p) => p.id === productId);

    if (quantity > 0 && product) {
      onAddToCart(product, quantity);
      setProductQuantities((prev) => ({
        ...prev,
        [productId]: 0,
      }));
    }
  };

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col">
          <h1 className="fs-5">Products</h1>
        </div>
        <div className="col-3">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row mt-4">
        {filteredProducts.map((product) => (
          <div className="col-3 mb-4" key={product.id}>
            <div className="card h-100 position-relative">
              <div className="overflow-hidden">
                <img
                  className="card-img-top"
                  src={product.images[0]}
                  alt={product.title}
                />
              </div>
              <div className="card-body">
                <h5
                  className="card-title"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={product.title}
                >
                  {truncateText(product.title, 25)}
                </h5>
                <p className="card-text">Price: ${product.price}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group border">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(product.id, -1)}
                    >
                      -
                    </button>
                    <span className="mx-2">
                      {productQuantities[product.id] || 0}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!(productQuantities[product.id] > 0)}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
              <div className="product-view">
                <Link
                  className="btn btn-primary"
                  to={`/product-view/${product.id}`}
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
