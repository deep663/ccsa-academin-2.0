import Footer from "./Footer";
import Header from "./Header";
import PropTypes from "prop-types";

function Layout({ childern }) {
  return (
    <>
      <Header />
      {childern}
      <Footer />
    </>
  );
}

Layout.propTypes = {
  childern: PropTypes.node.isRequired,
};

export default Layout;
