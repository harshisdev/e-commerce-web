import { useEffect, useState } from "react";
import {
  productCategoriApi,
  productListApi,
  productDeleteApi,
  productCategoriDeleteApi,
  productUpdateApi,
  categorytUpdateApi,
  uploadImageApi,
} from "../action/productApi";
import { Link, useNavigate } from "react-router-dom";
import { IoAddOutline, IoEyeOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { GrUpdate } from "react-icons/gr";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import Loader from "../component/Loader";

const ProductCard = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productQuantities, setProductQuantities] = useState({});
  const [showGotoCart, setShowGotoCart] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [relatedProductsCount, setRelatedProductsCount] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [showDeleteProductId, setShowDeleteProductId] = useState([]);
  const [showUpdateProductId, setShowUpdateProductId] = useState("");
  const [showUpdateCategoryModal, setshowUpdateCategoryModal] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  const accessToken = sessionStorage.getItem("accessToken");

  const userRole = useSelector((state) => state.userRole.role);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productListApi();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
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
      setShowGotoCart((prev) => ({
        ...prev,
        [productId]: true,
      }));
    }
  };

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const handleGoToCart = (productId) => {
    const quantity = productQuantities[productId] || 0;
    const product = filteredProducts.find((p) => p.id === productId);

    if (quantity > 0 && product) {
      navigate("/cart");
    }
  };

  const delateProductModal = (productId) => {
    setShowDeleteProductModal(true);
    setShowDeleteProductId(productId);
  };

  const delateProduct = async (showDeleteProductId) => {
    if (showDeleteProductId) {
      try {
        const data = await productDeleteApi(showDeleteProductId);
        if (data) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== showDeleteProductId)
          );
          setFilteredProducts((prevFiltered) =>
            prevFiltered.filter((product) => product.id !== showDeleteProductId)
          );
          setShowDeleteProductModal(false);
          toast.success("Product is delete.");
        }
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast.error("Failed to delete product not found");
      }
    }
  };

  const prepareDeleteCategory = async (categoryId) => {
    if (!categoryId) return;

    try {
      const allProducts = await productListApi();
      const related = allProducts.filter(
        (product) => product.category?.id === categoryId
      );

      setCategoryToDelete(categoryId);
      setRelatedProductsCount(related.length);
      setShowDeleteModal(true);
    } catch (error) {
      console.error("Error preparing category deletion:", error);
    }
  };

  const confirmDeleteCategory = async () => {
    try {
      const allProducts = await productListApi();
      const related = allProducts.filter(
        (product) => product.category?.id === categoryToDelete
      );

      for (const product of related) {
        await productDeleteApi(product.id);
      }

      await productCategoriDeleteApi(categoryToDelete);

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete)
      );
      setCategoryToDelete(null);
      setShowDeleteModal(false);
      toast.success("Category is delete successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    }
  };
  const productUpdateModal = async (productId) => {
    setShowUpdateModal(true);
    setShowUpdateProductId(productId);
    try {
      const allProducts = await productListApi();
      const product = allProducts.find((p) => p.id === productId);

      if (product) {
        setForm({
          title: product.title,
          price: product.price,
          description: product.description,
          images: [...product.images],
          categoryId: product.category?.id || "",
        });
      }
    } catch (error) {
      console.error("Error loading product for update:", error);
    }
  };

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    images: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, index) => {
    const updatedImages = [...form.images];
    updatedImages[index] = e.target.value;
    setForm((prev) => ({ ...prev, images: updatedImages }));
  };

  const removeImageField = () => {
    setForm((prev) => {
      if (prev.images.length > 1) {
        return { ...prev, images: prev.images.slice(0, -1) };
      }
      return prev;
    });
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      categoryId: form.categoryId,
    };
    try {
      await productUpdateApi(showUpdateProductId, payload);
      setShowUpdateModal(false);
      toast.success("Product updated successfully!");
      setProducts((prev) =>
        prev.map((p) => (p.id === showUpdateProductId ? { ...p, ...form } : p))
      );
      setFilteredProducts((prev) =>
        prev.map((p) => (p.id === showUpdateProductId ? { ...p, ...form } : p))
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImageApi(formData);
      const imageUrl = res.location;

      setFormData((prev) => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed");
    }
  };

  const confirmUpdateCategoryModal = (categoryId) => {
    setshowUpdateCategoryModal(true);
    setCategoryToUpdate(categoryId);
  };

  const confirmUpdateCategory = async () => {
    if (!categoryToUpdate) return;

    try {
      const payload = {
        name: formData.name,
        image: formData.image,
      };
      await categorytUpdateApi(categoryToUpdate, payload);

      // Update the categories list in state
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryToUpdate ? { ...cat, ...payload } : cat
        )
      );

      setshowUpdateCategoryModal(false);
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category.");
    }
  };

  return (
    <div className="container">
      <div className="row mt-4 justify-content-between">
        <div className="col-12">
          <h1 className="fs-5">Products</h1>
        </div>
      </div>
      <div
        className={`row ${userRole !== "admin" && "justify-content-between"}`}
      >
        <div className="col-auto d-none d-lg-flex align-items-center">
          <label className="fw-bold">Filter Products:</label>
        </div>
        <div
          className={`col-12 ${userRole === "admin" ? "col-md" : "col-lg-4"}`}
        >
          <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {userRole === "admin" && (
          <>
            <div className="col-auto mt-3 mt-md-0 d-none d-lg-flex align-items-center">
              <label className="fw-bold">Update & Delete Products:</label>
            </div>
            <div
              className={`col-12 mt-3 mt-md-0 ${
                userRole === "admin" ? "col-md" : "col-md-4"
              }`}
            >
              <div
                className="dropdown p-2 border rounded-2 dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                Categories Update & Delete
                <ul
                  className="dropdown-menu w-100 overflow-x-hidden z-1 p-0"
                  style={{ maxHeight: "400px" }}
                >
                  {categories.map((category) => (
                    <li
                      className=" px-3 py-2 d-flex justify-content-between align-items-center border-bottom"
                      key={category.id}
                    >
                      <span className="w-75">{category.name}</span>
                      <button
                        className="btn btn-success p-1 px-2 me-2"
                        onClick={() => confirmUpdateCategoryModal(category.id)}
                      >
                        <GrUpdate className="fs-5" />
                      </button>
                      <button
                        className="btn btn-danger p-1 px-2"
                        onClick={() => prepareDeleteCategory(category.id)}
                      >
                        <AiOutlineDelete className="fs-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
      {!loading && filteredProducts.length >= 0 ? (
        <div className="row mt-4">
          {filteredProducts.map((product) => (
            <div
              className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4"
              key={product.id}
            >
              <div className="card h-100">
                <div
                  className="overflow-hidden position-relative"
                  style={{ maxHeight: "355px" }}
                >
                  <img
                    className="card-img-top img-fluid"
                    src={product.images[0]}
                    alt={product.title}
                  />
                  <div
                    className="product-view"
                    style={{
                      bottom: "15px",
                      top: "unset",
                    }}
                  >
                    <Link
                      className="bg-light rounded-pill d-flex align-items-center"
                      to={`/view-product/${product.id}`}
                    >
                      <IoEyeOutline className="fs-3 text-black" />
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title" title={product.title}>
                    {truncateText(product.title, 25)}
                  </h5>
                  <p className={`card-text ${userRole === "admin" && "mb-0"}`}>
                    Price: ${product.price}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    {userRole !== "admin" && (
                      <>
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
                            <IoAddOutline className="fs-5" />
                          </button>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAddToCart(product.id)}
                          disabled={!(productQuantities[product.id] > 0)}
                        >
                          Add To Cart
                        </button>
                        {showGotoCart[product.id] && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleGoToCart(product.id)}
                          >
                            Go To Cart
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {userRole === "admin" && (
                  <>
                    <div
                      className="bg-light rounded-pill d-flex align-items-center product-view"
                      onClick={() => delateProductModal(product.id)}
                    >
                      <AiOutlineDelete className="fs-2 text-danger p-1" />
                    </div>
                    <div
                      className="bg-light rounded-pill d-flex align-items-center product-view"
                      style={{ left: "20px", right: "unset" }}
                      onClick={() => productUpdateModal(product.id)}
                    >
                      <GrUpdate className="fs-2 text-success p-1" />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {filteredProducts?.length === 0 && (
            <p className="text-center text-warning">
              Oops! No products available.
            </p>
          )}
        </div>
      ) : (
        <Loader />
      )}

      <Modal
        show={showDeleteProductModal}
        onHide={() => setShowDeleteProductModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Are you sure you want to delete this Product?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowDeleteProductModal(false)}
          >
            No
          </Button>
          <Button
            type="button"
            className="btn btn-danger"
            onClick={() => delateProduct(showDeleteProductId)}
          >
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUpdateCategoryModal}
        onHide={() => setshowUpdateCategoryModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Category</Modal.Title>
        </Modal.Header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            confirmUpdateCategory();
          }}
        >
          <Modal.Body>
            <div className="mb-3">
              <label className="mb-1">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                className="form-control"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="mb-1">Or Upload Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              className="btn btn-secondary"
              onClick={() => setshowUpdateCategoryModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn btn-primary">
              Update Category
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to delete this category?
            {relatedProductsCount > 0 && (
              <>
                <br />
                <strong>
                  {relatedProductsCount} product(s) will also be deleted.
                </strong>
              </>
            )}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            No
          </Button>
          <Button
            type="button"
            className="btn btn-danger"
            onClick={confirmDeleteCategory}
          >
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Images</label>
            {form.images.map((img, idx) => (
              <input
                key={idx}
                type="text"
                value={img}
                onChange={(e) => handleImageChange(e, idx)}
                className="form-control mb-2"
                placeholder={`Image URL #${idx + 1}`}
                required
              />
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline-danger me-4"
              onClick={removeImageField}
              disabled={form.images.length <= 1}
            >
              <AiOutlineDelete className="me-2 fs-5" />
              Remove Image
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-success"
              onClick={addImageField}
            >
              <IoAddOutline className="me-2 fs-5" />
              Add Image
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            className="btn btn-success"
            onClick={handleSubmit}
          >
            Update Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductCard;
