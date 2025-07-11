import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";

function BreadCrumb({ items }) {
  return (
    <Breadcrumb>
      {items.map((item, index) =>
        item.active ? (
          <Breadcrumb.Item key={index} active>
            {item.label}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item
            key={index}
            linkAs={Link}
            linkProps={{ to: item.to }}
          >
            {item.label}
          </Breadcrumb.Item>
        )
      )}
    </Breadcrumb>
  );
}

export default BreadCrumb;
