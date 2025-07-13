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
  const fileInputRef = useRef(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([""]);
  const [categories, setCategories] = useState([]);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");

  const allUserData = useSelector((state) => state.user.data);

  const handleImageChange = (e, index) => {
    const updatedImages = [...images];
    updatedImages[index] = e.target.value;
    setImages(updatedImages);
  };

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const removeImageField = () => {
    if (images?.length > 1) {
      setImages(images.slice(0, -1));
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
      setImages((prev) => [...prev, imageUrl]);
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
    if (!category) {
      toast.error("Category is required.");
      return;
    }
    if (!title) {
      toast.error("Title is required.");
      return;
    }
    if (!price) {
      toast.error("Price is required.");
      return;
    }
    if (!description) {
      toast.error("Description is required.");
      return;
    }
    if (!images || images.length === 0 || !images[0]) {
      toast.error("Image is required.");
      return;
    }
    setLoading(true);
    try {
      const productData = {
        categoryId: category,
        title: title,
        price: price,
        description: description,
        images: images,
      };
      await productListUpdateApi(productData);
      setShowViewProduct(true);
      toast.success("Product added successfully!");
      setCategory("");
      setTitle("");
      setPrice("");
      setDescription("");
      setImages([""]);
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
          <form
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            onSubmit={handleSubmit}
            className="p-4 border rounded"
          >
            <div className="mb-3">
              <label className="form-label">Category <sup className="text-danger">*</sup></label>
              <select
                name="categoryId"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
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
              <label className="form-label">Title <sup className="text-danger">*</sup></label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price <sup className="text-danger">*</sup></label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description <sup className="text-danger">*</sup></label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Images <sup className="text-danger">*</sup></label>
              <br />
              {images?.map((img, idx) => (
                <div key={idx} className="mb-2">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => handleImageChange(e, idx)}
                    className="form-control mb-1"
                  />
                  {img && <img src={img} alt={`preview-${idx}`} height="60" />}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-sm btn-outline-danger me-4 mt-2"
                onClick={removeImageField}
                disabled={images.length <= 1}
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
