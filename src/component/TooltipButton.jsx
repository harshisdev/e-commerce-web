import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const TooltipButton = () => {
  useEffect(() => {
    // Wait for Bootstrap to be available in the global scope
    const bootstrap = window.bootstrap;
    if (bootstrap) {
      const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, []);

  return (
    <div className="p-3">
      <button
        type="button"
        className="btn btn-secondary"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Tooltip on top"
      >
        Tooltip on top
      </button>
    </div>
  );
};

export default TooltipButton;
