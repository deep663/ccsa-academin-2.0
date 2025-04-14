import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-transparent pb-16 px-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-white text-center">
          Contact Us
        </h1>
        <div className="flex flex-col md:flex-row justify-around max-w-full bg-gray-100 rounded-lg mt-10"> 
          {/* Contact Information */}
          <div className="w-full p-6">
            <h2 className="text-xl font-semibold text-[#4f90d1]"><FaMapMarkerAlt/> Address</h2>
            <p className="text-gray-700 mt-1">
              Centre for Computer Science and Applications, <br />
              Dibrugarh University, Dibrugarh-786004, <br />
              Assam, India
            </p>

            <h2 className="text-xl font-semibold text-[#4f90d1] mt-4"><FaEnvelope/> Email</h2>
            <p className="text-gray-700">
              <a
                href="mailto:ccsduoffice@gmail.com"
                className="text-[#30834d] hover:underline"
              >
                ccsduoffice@gmail.com
              </a>
            </p>
          </div>

          {/* Contact Form */}
          <div className="w-full p-6">
            <h2 className="text-xl font-semibold text-[#192f59] text-center">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#30834d] focus:border-[#30834d]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#30834d] focus:border-[#30834d]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#30834d] focus:border-[#30834d]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#30834d] text-white py-2 rounded-md hover:bg-[#26763d]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white text-center">Location on Map</h3>
          <div className="mt-4 border border-gray-300 shadow-md">
            <iframe
              title="CCSA Location"
              className="w-full h-72 rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.6347491405036!2d94.89528137547951!3d27.449491576331322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3740a2daaaaaaaab%3A0x3c0d978a22c76583!2sDibrugarh%20University!5e0!3m2!1sen!2sin!4v1736525813607!5m2!1sen!2sin"
              allowFullScreen="true"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
