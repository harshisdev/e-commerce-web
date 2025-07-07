import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-2 bg-danger-subtle">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            © {currentYear} E-Commerce-Web. All rights reserved by Harsh Kumar.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
