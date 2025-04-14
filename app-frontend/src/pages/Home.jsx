import ContactUs from "../components/contactUs";
import About from "../components/About";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.fields);
  return (
    <>
      <div className="bg-[#192f59]">
        {/* Hero Section */}
        <section
          className="relative text-white py-16 text-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(25, 47, 89, 0.2), #192f59), url('/ccsa.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed", // Enables parallax effect
          }}
        >
          <div className="max-w-full mx-auto h-96 flex flex-col justify-center">
            <h1 className="text-4xl font-bold">Welcome to CCSA Academics</h1>
            <p className="mt-4 text-lg">
              A platform for students & teachers to manage assignments, notes,
              and projects efficiently.
            </p>
            <button
              onClick={() =>{(user === null)? navigate("/login") : navigate("/dashboard")}}
              className="mt-6 mx-auto bg-[#30834d] text-white px-6 py-2 rounded-md hover:bg-[#26763d]"
            >
              Get Started
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white">What You Can Do</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-200">
              {/* Feature Cards */}
              <div className="bg-green-700 shadow-md p-6 rounded-lg ">
                <h3 className="text-xl font-semibold text-white">
                  Upload & View Notes
                </h3>
                <p className="mt-2">
                  Teachers upload notes, and students can access them anytime.
                </p>
              </div>
              <div className="bg-green-700 shadow-md p-6 rounded-lg ">
                <h3 className="text-xl font-semibold text-white">
                  Submit Assignments
                </h3>
                <p className="mt-2">
                  Students can submit assignments and get feedback from
                  teachers.
                </p>
              </div>
              <div className="bg-green-700 shadow-md p-6 rounded-lg ">
                <h3 className="text-xl font-semibold text-white">
                  Manage Marks & Attendance
                </h3>
                <p className="mt-2">
                  Teachers can upload marks, and students can track their
                  progress.
                </p>
              </div>
            </div>
          </div>
        </section>
        <About />
        <ContactUs />
      </div>
    </>
  );
};

export default Home;
