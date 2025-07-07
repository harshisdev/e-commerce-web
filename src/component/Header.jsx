import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginProfileApi } from "../action/productApi";
import { toast } from "react-toastify";
import { MdOutlineLogout } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";

const Header = ({ cartCount }) => {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");
  const [profileData, setprofileData] = useState(null);
  const getRole = sessionStorage.getItem("role");

  useEffect(() => {
    const loginProfile = async () => {
      if (!accessToken) return;

      try {
        const data = await loginProfileApi(accessToken);
        setprofileData(data);
        if (data) {
          sessionStorage.setItem("role", data?.role);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
        toast.error("Failed to load user profile.");
      }
    };

    loginProfile();
  }, [accessToken]);

  const handleLogout = () => {
    toast.success("Logout successfully !");
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };
  return (
    <header className="bg-light position-sticky top-0 z-1">
      <div className="container">
        <div className="row align-items-center justify-content-between py-3">
          <div className="col-auto">E-Coumerce-Web</div>
          <div className="col-auto d-flex align-items-center">
            {!profileData || !accessToken ? (
              <>
                <Link
                  to="/register"
                  className="text-black text-decoration-none"
                >
                  Register
                </Link>
                <span className="px-2 text-black">/</span>
                <Link to="/login" className="text-decoration-none text-black">
                  Login
                </Link>
              </>
            ) : (
              ""
            )}
            <div>
              <Link
                to="/cart"
                className="btn btn-btn-outline-primary position-relative ms-3 p-0 border-0"
              >
                <span className="fs-4"> 🛒</span>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount > 0 ? cartCount : ""}
                </span>
              </Link>
            </div>
            {profileData && accessToken && (
              <div className="ms-2 d-flex align-items-center">
                <div>
                  {profileData.name} (
                  <span style={{ textTransform: "capitalize" }}>
                    {profileData.role}
                  </span>
                  )
                </div>
                <div className="dropdown pe-3">
                  <div
                    style={{ width: "30px", height: "30px", cursor: "pointer" }}
                    className="ms-2 dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      className="rounded-pill img-fluid"
                      src={profileData.avatar || "/default-avatar.png"}
                      alt={profileData.name}
                    />
                  </div>
                  <ul
                    className="dropdown-menu mt-3 p-0"
                    style={{ minWidth: "190px" }}
                  >
                    {getRole === "admin" && (
                      <>
                        <li className="bg-success border-bottom">
                          <Link
                            to={"/add-product"}
                            className="ms-2 d-block py-1 text-white text-decoration-none"
                          >
                            <IoAddOutline className="me-2 fs-5" />
                            Add Product
                          </Link>
                        </li>
                        <li className="bg-success border-bottom">
                          <Link
                            to={"/remove-product"}
                            className="ms-2 d-block py-1 text-white text-decoration-none"
                          >
                            <AiOutlineDelete className="me-2 fs-5" />
                            Remove Product
                          </Link>
                        </li>
                        <li className="bg-success border-bottom">
                          <Link
                            to={"/add-category"}
                            className="ms-2 d-block py-1 text-white text-decoration-none"
                          >
                            <IoAddOutline className="me-2 fs-5" />
                            Add Category
                          </Link>
                        </li>
                        <li className="bg-success border-bottom">
                          <Link
                            to={"/remove-category"}
                            className="ms-2 d-block py-1 text-white text-decoration-none"
                          >
                            <AiOutlineDelete className="me-2 fs-5" />
                            Remove Category
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="bg-success">
                      <a
                        className="ms-2 d-block py-1 text-white text-decoration-none"
                        onClick={handleLogout}
                      >
                        <MdOutlineLogout className="me-2 fs-5" />
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
