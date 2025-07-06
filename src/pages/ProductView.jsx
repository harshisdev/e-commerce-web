import React, { useEffect, useState } from "react";
import { productViewiApi } from "../action/productApi";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";

const ProductView = () => {
  const { id } = useParams();
  const [productView, setProductView] = useState();

  useEffect(() => {
    const fetchproductViewi = async () => {
      try {
        const data = await productViewiApi({ id });
        setProductView(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchproductViewi();
  }, [id]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <Link to="/" className="btn btn-outline-primary">
            Back To Page
          </Link>
        </div>
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="carousel-wrapper" data-aos="fade-up">
              <Slider {...settings}>
                {productView?.images.map((img, index) => (
                  <div key={index} className="overflow-hidden">
                    <img
                      src={img}
                      alt={productView?.title}
                      style={{ width: "100%" }}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="card-body mt-2">
              <h5 className="card-title" title={productView?.title}>
                {productView?.title}
              </h5>
              <p className="card-text">Price: ${productView?.price}</p>
              <p>{productView?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
