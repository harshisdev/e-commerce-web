import { useEffect, useState } from "react";
import { productCategoriUpdateApi, uploadImageApi } from "../action/productApi";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../component/BreadCrumb";

const AddCategoryPage = () => {
  const [showViewCategory, setShowViewCategory] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [!accessToken]);

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
      setIsUploading(true);
      const res = await uploadImageApi(formData);
      setImageUrl(res.location);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Name is required.");
      return;
    }
    if (!imageUrl) {
      toast.error("Image is required.");
      return;
    }

    const payload = {
      name: name,
      image: imageUrl,
    };

    try {
      await productCategoriUpdateApi(payload);
      setShowViewCategory(true);
      toast.success("Category added successfully!");
      setName("");
      setImageUrl("");
    } catch (error) {
      console.error("Failed to add category:", error);

      if (
        error?.response?.data?.code === "SQLITE_CONSTRAINT_UNIQUE" &&
        error?.response?.data?.message?.includes("category.slug")
      ) {
        toast.error("A category with this name already exists.");
      } else {
        toast.error("Failed to add category");
      }
    }
  };

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Add New Category", active: true },
  ];

  return (
    <div className="container minHeight">
      <div className="row py-3">
        <div className="col-12">
          <BreadCrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-6 mb-4">
          <form onSubmit={handleSubmit} className="p-4 border rounded">
            <div className="mb-3">
              <label className="mb-1">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                className="form-control"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="mb-1">Upload Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </div>

            {imageUrl && (
              <div className="mb-3 text-center">
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-outline-success px-3 rounded-5"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Add Category"}
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
          <p>Do you want to view the categories?</p>
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
