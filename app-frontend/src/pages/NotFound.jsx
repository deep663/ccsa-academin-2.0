import { Link } from 'react-router-dom'; 

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <nav className="w-full bg-[#192f59] text-white p-4">
        <h1 className="text-2xl">Dashboard</h1>
      </nav>
      <div className="flex flex-col items-center justify-center flex-1">
        <h2 className="text-6xl font-bold text-red-500">404</h2>
        <h3 className="text-2xl font-semibold mt-4">Page Not Found</h3>
        <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
        <Link onClick={window.history.back()} className="mt-4 bg-[#30834d] text-white px-4 py-2 rounded">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;