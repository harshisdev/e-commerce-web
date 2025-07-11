import React, { useEffect, useState } from "react";
import { productCategoriUpdateApi, uploadImageApi } from "../action/productApi";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../component/BreadCrumb";

const AddCategoryPage = () => {
  const [showViewCategory, setShowViewCategory] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");
  const getRole = sessionStorage.getItem("role");
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productCategoriUpdateApi(formData);
      setShowViewCategory(true);
      toast.success("Category added successfully!");
      setFormData({ name: "", image: "" });
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error("Failed to add category");
    }
  };

  useEffect(() => {
    if (!accessToken && getRole !== "Admin") {
      navigate("/");
    }
  }, [!accessToken, getRole !== "Admin"]);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Add New Category", active: true },
  ];

  return (
    <div className="container minHeight">
      <div className="row">
        <div className="col-12">
          <BreadCrumb items={breadcrumbItems} />
          <h2 className="my-4 fs-5">Add New Category</h2>
        </div>
      </div>
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-6">
          <form onSubmit={handleSubmit} className="p-4 border rounded w-96">
            <div className="mb-3">
              <label className="mb-1">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <div className="mb-3">
                <label className="mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  className="form-control"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-success">
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        show={showViewCategory}
        onHide={() => setShowViewCategory(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>View Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to view category</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowViewCategory(false)}
          >
            No
          </Button>
          <Link to="/" className="btn btn-primary">
            View Categories
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCategoryPage;
