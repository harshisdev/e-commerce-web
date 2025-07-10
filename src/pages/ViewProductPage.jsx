import { useEffect, useState } from "react";
import { productViewiApi } from "../action/productApi";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const ViewProductPage = () => {
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
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: productView?.images?.length > 1,
    dots: productView?.images?.length > 1,
  };

  return (
    <div className="container minHeight">
      <div className="row mt-4 justify-content-center position-relative">
        <Link
          to="/"
          style={{
            position: "absolute",
            top: "-15px",
            left: "0px",
            textAlign: "end",
            color: "#000",
          }}
        >
          <IoArrowBackCircleOutline className="fs-1" />
        </Link>
        <div className="col-12 col-md-6 col-lg-4 my-4">
          <div className="card h-100">
            <div className="carousel-wrapper" data-aos="fade-up">
              {productView?.images?.length > 1 ? (
                <Slider {...settings}>
                  {productView.images.map((img, index) => (
                    <div key={index} className="overflow-hidden">
                      <img
                        src={img}
                        alt={productView?.title}
                        style={{ width: "100%" }}
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="overflow-hidden">
                  <img
                    src={productView?.images?.[0]}
                    alt={productView?.title}
                    style={{ width: "100%" }}
                  />
                </div>
              )}
            </div>
            <div className="card-body mt-2">
              <h5 className="card-title" title={productView?.title}>
                {productView?.title}
              </h5>
              <p className="card-text">Price: ${productView?.price}</p>
              <p className="mb-0">{productView?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
