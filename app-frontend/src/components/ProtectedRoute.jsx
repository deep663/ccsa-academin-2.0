import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ProtectedRoute = ({ allowedRoles, redirectTo = "/dashboard" }) => {
  const user = useSelector((s) => s.user.fields);
  const userRole = user?.role;

  // If the user’s role is not in the allowedRoles list, redirect them
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.array.isRequired,
  redirectTo: PropTypes.string,
};

export default ProtectedRoute;
