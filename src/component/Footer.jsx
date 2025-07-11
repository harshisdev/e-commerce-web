import { useSelector } from "react-redux";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const allUserData = useSelector((state) => state.user.data);
  return (
    <footer className="py-2 bg-black shadow">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center text-white">
            © {currentYear} E-Commerce-
            {allUserData === "admin" ? "Store" : "Web"}. All rights reserved by
            Harsh Kumar.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
