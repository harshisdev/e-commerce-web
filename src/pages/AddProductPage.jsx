import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
import {
  productCategoriApi,
  productListUpdateApi,
  uploadImageApi,
} from "../action/productApi";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../component/BreadCrumb";
import { useSelector } from "react-redux";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    categoryId: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");

  const allUserData = useSelector((state) => state.user.data);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, index) => {
    const updatedImages = [...form.images];
    updatedImages[index] = e.target.value;
    setForm({ ...form, images: updatedImages });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  const removeImageField = () => {
    if (form.images.length > 1) {
      const updatedImages = form.images.slice(0, -1);
      setForm({ ...form, images: updatedImages });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await uploadImageApi(formData);
      const imageUrl = uploadRes.location;

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      toast.success("Image uploaded successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
      };
      await productListUpdateApi(productData);
      setShowViewProduct(true);
      toast.success("Product added successfully!");
      setForm({
        title: "",
        price: "",
        description: "",
        categoryId: "",
        images: [""],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (!accessToken && allUserData?.role !== "admin") {
      navigate("/");
    }
  }, [!accessToken, allUserData?.role !== "admin"]);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Add New Product", active: true },
  ];

  return (
    <div className="container minHeight">
      <div className="row py-3">
        <div className="col-12">
          <BreadCrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 mb-4">
          <form onSubmit={handleSubmit} className="p-4 border rounded">
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

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
              <br />
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
                className="btn btn-sm btn-outline-danger me-4 mt-2"
                onClick={removeImageField}
                disabled={form.images.length <= 1}
              >
                <AiOutlineDelete className="me-2 fs-5" />
                Remove URL
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-success mt-2"
                onClick={addImageField}
              >
                <IoAddOutline className="me-2 fs-5" />
                Add URL
              </button>
            </div>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-outline-success px-3 rounded-5"
                disabled={loading || categories.length === 0}
              >
                {loading ? "Submitting..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        show={showViewProduct}
        onHide={() => setShowViewProduct(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>View Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to view Product</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowViewProduct(false)}
          >
            No
          </Button>
          <Link to="/" className="btn btn-primary">
            View Products
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProductPage;
