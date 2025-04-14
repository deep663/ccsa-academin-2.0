import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Toaster = ({
  message,
  type,
  onClose,
  redirect,
  redirectLink,
  redirectButtonText,
}) => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
      if (redirect) {
        navigate(redirectLink);
      }
    }, 3000); // Auto close after 3 sec

    return () => clearTimeout(timer);
  }, [onClose, redirect, redirectLink, navigate]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-yellow-500"; // Warning

  return (
    show && (
      <div
        className={`fixed bottom-5 right-5 transform -translate-x-1/2 p-4 rounded shadow-lg text-white ${bgColor} z-100`}
      >
        {message}
        {redirect && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-4 py-2 px-4 rounded"
            onClick={() => navigate(redirectLink)}
          >
            {redirectButtonText}
          </button>
        )}
      </div>
    )
  );
};

Toaster.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning"]).isRequired,
  onClose: PropTypes.func.isRequired,
  redirect: PropTypes.bool,
  redirectLink: PropTypes.string,
  redirectButtonText: PropTypes.string,
};

Toaster.defaultProps = {
  redirect: false,
  redirectLink: "",
  redirectButtonText: "",
};

export default Toaster;