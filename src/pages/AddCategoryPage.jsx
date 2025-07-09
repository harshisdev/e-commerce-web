import React, { useState } from "react";
import { productCategoriUpdateApi } from "../action/productApi";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const AddCategoryPage = () => {
  const [showViewCategory, setShowViewCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div className="container minHeight d-flex justify-content-center align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-6">
          <form onSubmit={handleSubmit} className="p-4 border rounded w-96">
            <div className="mb-3">
              <label>Name</label>
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
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                className="form-control"
                value={formData.image}
                onChange={handleChange}
                required
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
