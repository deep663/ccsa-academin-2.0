import { Outlet, Navigate } from 'react-router-dom';
import PropTypes from "prop-types";

const AuthOutlet = ({ fallbackPath }) => {
    const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = user ? true : false;

  if (!isLoggedIn) {
    return <Navigate to={fallbackPath} />;
  }

  return <Outlet />;
};

AuthOutlet.propTypes = {
    fallbackPath: PropTypes.string.isRequired,
  };

export default AuthOutlet;