import { useEffect, useState } from "react";
import { userDeleteApi, userProfileGetApi } from "../action/productApi";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../component/BreadCrumb";
import { useDispatch } from "react-redux";
import { logout } from "../app/slice/userSlice";

const DeletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState(location.state?.userId);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userIdNotFound, setUserIdNotFound] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const res = await userProfileGetApi(userId, accessToken);
          if (res) {
            setName(res.name || "");
          } else {
            toast.error("ID is wrong.");
          }
        } catch (error) {
          toast.error("Failed to fetch user.");
          setName("");
          setUserIdNotFound(true);
          console.error("User Not Found", error);
        }
      };

      fetchUser();
    }
  }, [userId]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("User ID is required.");
    if (userIdNotFound) {
      toast.error("Invalid user id. cannot delete.");
      setName("");
      return;
    }
    setLoading(true);
    try {
      await userDeleteApi(userId);
      toast.success("Account deleted successfully!");
      if (location.state?.userId === userId) {
        sessionStorage.clear();
        localStorage.clear();
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.error("Account deletion failed:", error);
      toast.error("This user is not available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [accessToken]);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Delete Account", active: true },
  ];

  return (
    <div className="container minHeight">
      <div className="row py-3">
        <div className="col-12">
          <BreadCrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-center mb-4">
          <div
            className="card p-4 shadow-lg"
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <h4 className="mb-3 text-center">Delete Account</h4>
            {name && <p className="text-center text-primary">Hey, {name}</p>}
            <form onSubmit={handleDelete}>
              <div className="mb-3">
                <label htmlFor="userId" className="form-label">
                  User ID <sup className="text-danger">*</sup>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-danger px-3 rounded-5"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePage;
