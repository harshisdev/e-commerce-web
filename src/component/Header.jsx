import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginProfileApi } from "../action/productApi";
import { toast } from "react-toastify";
import { MdOutlineLogout } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import defaultUserImg from "../assets/images/default-user.png";

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
        sessionStorage.clear();
        localStorage.clear();
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

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <header className="bg-light position-sticky top-0 z-2 shadow">
      <div className="container">
        <div className="row align-items-center justify-content-between py-3">
          <div className="col-auto">
            E-Coumerce-{getRole === "admin" ? "Store" : "Web"}
          </div>
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
            {getRole !== "admin" && (
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
            )}
            {profileData && accessToken && (
              <div className="ms-2 d-flex align-items-center">
                <div className="d-none d-sm-block">
                  {truncateText(profileData.name, 10)}(
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
                      src={profileData.avatar || { defaultUserImg }}
                      alt={profileData.name}
                    />
                  </div>
                  <ul
                    className="dropdown-menu mt-3 p-0"
                    style={{ minWidth: "190px" }}
                  >
                    {getRole === "admin" && (
                      <>
                        <li className="bg-success border-bottom d-block d-sm-none py-2 text-white">
                          <span className="ms-2">
                            <CiUser className="fs-5 me-1" />{" "}
                            {truncateText(profileData.name, 7)} (
                            <span style={{ textTransform: "capitalize" }}>
                              {profileData.role}
                            </span>
                            )
                          </span>
                        </li>
                        <li className="bg-success border-bottom">
                          <Link
                            to={"/add-category"}
                            className="ms-2 d-block py-2 text-white text-decoration-none"
                          >
                            <IoAddOutline className="me-2 fs-5" />
                            Add Category
                          </Link>
                        </li>
                        <li className="bg-success border-bottom">
                          <Link
                            to={"/add-product"}
                            className="ms-2 d-block py-2 text-white text-decoration-none"
                          >
                            <IoAddOutline className="me-2 fs-5" />
                            Add Product
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="bg-success border-bottom text-white">
                      <Link
                        to={`/update-profile/${profileData.id}`}
                        className="ms-2 d-block py-2 text-white text-decoration-none"
                      >
                        <CiUser className="fs-5 me-1" /> Profile Update
                      </Link>
                    </li>
                    <li className="bg-success">
                      <Link
                        className="ms-2 d-block py-2 text-white text-decoration-none"
                        onClick={handleLogout}
                      >
                        <MdOutlineLogout className="me-2 fs-5" />
                        Logout
                      </Link>
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
