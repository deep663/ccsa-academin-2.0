import { useState } from 'react';
import { getTeachers } from "../utils/api";

function About() {
  const [activeSection, setActiveSection] = useState('center');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyData, setFacultyData] = useState([]);

  const getFacultyData = async () => {
    try {
      const response = await getTeachers();
      // Assuming response is an array of faculty objects
      const formattedData = response?.data?.data?.map(faculty => ({
        id: faculty._id,
        name: faculty.user.name,
        designation: faculty.designation,
        qualifications: faculty.educational_qualifications.map(qual => `${qual.degree} from ${qual.institution}`).join(', '),
        expertise: faculty.expertise || 'N/A', // Assuming expertise is part of the response, adjust as necessary
        image: faculty.avatar || 'https://via.placeholder.com/150' // Fallback image if avatar is not available
      }));
      console.log(formattedData);
      setFacultyData(formattedData);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };


  return (
    <section className="bg-transparent pb-16 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">About Us</h1>

        {/* Section buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg ${activeSection === 'center' ? 'bg-green-600' : 'bg-green-800'}`}
            onClick={() => setActiveSection('center')}
          >
            Center
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeSection === 'faculty' ? 'bg-green-600' : 'bg-green-800'}`}
            onClick={() => {setActiveSection('faculty'); getFacultyData();}}
          >
            Faculty
          </button>
        </div>

        {/* Center Description */}
        {activeSection === 'center' && (
          <div className="bg-green-700 p-6 rounded-lg">
            <p>
              Centre for Computer Science and Applications (formerly known as Centre for Computer Studies) is one of the
              premier institutes of North-East-India imparting computer education. Dibrugarh University initiated its journey of
              imparting computer education by establishing a Computer Centre in 1976. The Computer Centre was established with the
              objective of creating Computer awareness among the teachers, research scholars and employees of the University...
            </p>
          </div>
        )}

        {/* Faculty Section */}
        {activeSection === 'faculty' && (
          <div className="bg-green-700 p-6 rounded-lg">
            {/* List of faculty */}
            {!selectedFaculty ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Our Faculty</h2>
                <ul className="space-y-2">
                  {facultyData.map(faculty => (
                    <li key={faculty.id}>
                      <button
                        onClick={() => setSelectedFaculty(faculty)}
                        className="text-left w-full bg-green-800 hover:bg-green-900 p-2 rounded"
                      >
                        {faculty.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              // Faculty detail view
              <div>
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="mb-4 text-sm text-blue-300 underline"
                >
                  ← Back to faculty list
                </button>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <img
                    src={selectedFaculty.image}
                    alt={selectedFaculty.name}
                    className="w-40 h-40 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-bold">{selectedFaculty.name}</h3>
                    <p><strong>Designation:</strong> {selectedFaculty.designation}</p>
                    <p><strong>Qualifications:</strong> {selectedFaculty.qualifications}</p>
                    <p><strong>Expertise:</strong> {selectedFaculty.expertise}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default About;
