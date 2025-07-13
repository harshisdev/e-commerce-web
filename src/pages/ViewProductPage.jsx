import { useEffect, useState } from "react";
import { productViewiApi } from "../action/productApi";
import { useLocation, useParams } from "react-router-dom";
import Slider from "react-slick";
import BreadCrumb from "../component/BreadCrumb";

const ViewProductPage = () => {
  const location = useLocation();
  const productId = location.state?.productId;
  const [productView, setProductView] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchproductViewi = async () => {
      setLoading(true);
      try {
        const data = await productViewiApi(productId);
        setProductView(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchproductViewi();
  }, [productId]);

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

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "View Product", active: true },
  ];

  return (
    <div className="container minHeight">
      {!loading ? (
        <div className="row pt-4 justify-content-center position-relative">
          <div className="col-12">
            <BreadCrumb items={breadcrumbItems} />
          </div>
          {productView ? (
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
          ) : (
            <p className="text-center text-warning">
              Oops! No products available.
            </p>
          )}
        </div>
      ) : (
        "loading..."
      )}
    </div>
  );
};

export default ViewProductPage;
