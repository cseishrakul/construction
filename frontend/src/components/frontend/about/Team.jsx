import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("https://construction-aqri.onrender.com/api/get-teams");
        const data = await res.json();
        if (data.status) {
          setTeamMembers(data.data);
        } else {
          console.error("Failed to fetch teams");
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };

    fetchTeams();
  }, []);

  return (
    <section className="bg-gray-100 py-12">
      <div className="container">
        {/* Section Title */}
        <div className="text-center mb-12 px-4">
          <span className="text-sm uppercase font-bold text-purple-600 tracking-wider">
            Our Team
          </span>
          <h2 className="text-4xl font-bold my-3 text-gray-800">
            Meet Our Experts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Behind every successful project is a dedicated team of engineers, architects,
            and managers committed to excellence in construction.
          </p>
        </div>

        {/* Team Cards */}
        <div className="row">
          {teamMembers.map((member) => (
            <div className="col-md-3 mb-4" key={member.id}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <img
                  src={`https://construction-aqri.onrender.com/uploads/teams/small/${member.image}`}
                  alt={member.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4 text-center">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </h5>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Job Post Section */}
        <div className="mt-20 bg-white rounded-xl shadow-md p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Join Our Growing Team!
          </h3>
          <p className="text-gray-600 mb-4">
            We're hiring experienced site engineers, project managers, and civil workers. Be a part
            of our mission to build better, smarter, and safer infrastructure.
          </p>
          <Link to="/careers">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-200">
              View Job Openings
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Team;
